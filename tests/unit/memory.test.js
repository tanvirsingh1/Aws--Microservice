const {
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
    listFragments,
  } = require('../../src/model/data/memory/index.js');


  describe('Fragment_Index Tests', () => {
   
test('Data can be successfully stored and Retrieved', async () => {
    const fragment = { ownerId: 'ownerTestId', id: 'testId', fragment: 'This is fragment' };

    await writeFragment(fragment);
    const read_data = await readFragment(fragment.ownerId, fragment.id);
    expect(read_data.fragment).toBe('This is fragment');
  })

  test('Getting Incorrect data, when Incorrect Inputs provided', async () => {
    const fragment = { ownerId: 'ownerTestId', id: 'testId', fragment: 'This is fragment' };

    await writeFragment(fragment);
    const read_data = await readFragment("ffrfr", fragment.id);
    expect(read_data).toBe(undefined);
  })
  test('Successfully Listing array of Fragments', async () => {
    await writeFragment({ownerId: 'ownerTestId', id: 'testId', fragment: 'Testing Fragment 1' });
    await writeFragmentData('ownerTestId', 'testId', 'Testing Fragment 1' );

    await writeFragment({ownerId: 'ownerTestId', id: 'testId 2', fragment: 'Testing Fragment 2' });
    await writeFragmentData('ownerTestId', 'testId 2', 'Testing Fragment 2' );

    const read_data = await listFragments('ownerTestId', true);
    expect(read_data).toEqual([
        {ownerId: 'ownerTestId', id: 'testId', fragment: 'Testing Fragment 1'},
        {ownerId: 'ownerTestId', id: 'testId 2', fragment: 'Testing Fragment 2'}
    ]);
});
  
test('Reading the Data from the Fragment', async() => {
    await writeFragment({ownerId: 'ownerTestId', id: 'testId', fragment: 'Testing Fragment 1' });
    await writeFragmentData('ownerTestId', 'testId', 'Testing Fragment 1' );
    const read_data = await readFragmentData('ownerTestId', 'testId');

    expect(read_data).toBe('Testing Fragment 1')
})



  });