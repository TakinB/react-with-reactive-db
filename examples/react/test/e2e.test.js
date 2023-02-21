import {
    Selector
} from 'testcafe';
import AsyncTestUtil from 'async-test-util';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-unused-expressions
fixture`Example page`
    .page`http://0.0.0.0:8888/`;


test('insert/edit/remove a flag', async t => {
    // clear previous flags
    const flagElements = Selector('#flags-list li');
    const amount = await flagElements.count;

    for (let i = 0; i < amount; i++) {
        await t.click('.delete');
    }

    // input name
    const flagNameInput = Selector('#insert-box input[name=name]');
    await t
        .expect(flagNameInput.value).eql('', 'input is empty')
        .typeText(flagNameInput, 'BobKelso')
        .expect(flagNameInput.value).contains('Kelso', 'input contains name');

    // input value
    const flagValueInput = Selector('#insert-box input[name=value]');
    await t
        .expect(flagValueInput.value).eql('', 'input is empty')
        .typeText(flagValueInput, 'black')
        .expect(flagValueInput.value).contains('black', 'input contains value');

    // submit
    await t.click('#insert-box button');
    await AsyncTestUtil.wait(200);

    const flagListElement = Selector('#flags-list li');
    await t.expect(flagListElement.textContent).contains('Kelso', 'list-item contains name');
});
