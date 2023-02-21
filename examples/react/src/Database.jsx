import {
    createRxDatabase,
    removeRxDatabase,
    addRxPlugin
} from 'rxdb';
import {
    getRxStorageDexie
} from 'rxdb/plugins/storage-dexie';
import {
    flagSchema
} from './Schema';

import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';

import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
addRxPlugin(RxDBLeaderElectionPlugin);

const syncURL = 'http://' + window.location.hostname + ':10102/';
console.log('host: ' + syncURL);

let dbPromise = null;




const _create = async () => {
    console.log('removing previous databases, remove this if required')
    console.log(getRxStorageDexie())
    // await removeRxDatabase('flagsreactdb', 'adapter');
    // await removeRxDatabase('flagsreactdb', getRxStorageDexie());
    console.log('DatabaseService: creating database..');
    const db = await createRxDatabase({
        name: 'flagsreactdb'+ new Date().getTime(),
        storage: getRxStorageDexie()
    });

    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    // show leadership in title
    db.waitForLeadership().then(() => {
        console.log('isLeader now');
        document.title = '♛ ' + document.title;
    });

    // create collections
    console.log('DatabaseService: create collections');
    await db.addCollections({
        flags: {
            schema: flagSchema,
            methods: {
                hpPercent() {
                    return this.hp / this.maxHP * 100;
                }
            }
        }
    });

    // hooks
    console.log('DatabaseService: add hooks');
    db.collections.flags.preInsert(docObj => {
        const { value } = docObj;
        return db.collections.flags.findOne({
            selector: { value }
        }).exec().then(has => {
            if (has !== null) {
                console.error('another flag already has the value ' + value);
                throw new Error('value already there');
            }
            return db;
        });
    });

    // sync
    console.log('DatabaseService: sync');
    await Promise.all(
        Object.values(db.collections).map(async (col) => {
            try {
                // create the CouchDB database
                await fetch(
                    syncURL + col.name + '/',
                    {
                        method: 'PUT'
                    }
                );
            } catch (err) { }
        })
    );
    console.log('DatabaseService: sync - start live');
    Object.values(db.collections).map(col => col.name).map(colName => {
        const url = syncURL + colName + '/';
        console.log('url: ' + url);
        const replicationState = replicateCouchDB({
            collection: db[colName],
            url,
            live: true,
            pull: {},
            push: {},
            autoStart: true
        });
        replicationState.error$.subscribe(err => {
            console.log('Got replication error:');
            console.dir(err);
        });
    });

    return db;
};

export const get = () => {
    if (!dbPromise)
        dbPromise = _create();
    return dbPromise;
};
