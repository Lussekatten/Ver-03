//let categoryArr = [];
let bucketListArr = [];
let categoriesFound = [];
let categoriesFoundBeforeInsertionOfNewActivity = [];
let idForEdit = 0;
const MAX_ALLOWED_CATEGORIES = 4;
const startingPoint = document.getElementById('bucketLists');
const theSelectCat = document.getElementById('activityCategory');

//localStorage.clear();

//Create an array of objects (simulates that some data already exits), but not in the desired format
//The Id:s are not there, for example.
let startingActivities = [
    {
        beenThereDoneThat: false,
        catName: 'Travel',
        description: 'Thailand'
    },
    {
        beenThereDoneThat: false,
        catName: 'Travel',
        description: 'Cap Verde'
    },
    {
        beenThereDoneThat: false,
        catName: 'Foods',
        description: 'Roasted mellon'
    },
    {
        beenThereDoneThat: false,
        catName: 'Travel',
        description: 'Cyprus'
    },
    {
        beenThereDoneThat: false,
        catName: 'Travel',
        description: 'Fuerte Ventura'
    },
    {
        beenThereDoneThat: false,
        catName: 'Foods',
        description: 'Grilled lemon'
    }
];

//If there are items in the local storage, read from it
if (localStorage.getItem('bList') != null) {
    bucketListArr = JSON.parse(localStorage.getItem("bList"));
    refreshTheBucketList();
}
else {
    initializeBucketList(); //Read date from "external source" - local array in this file
    refreshTheBucketList();
}

function createCheckboxButton(id, myDiv, doneIt) {
    //This is the checkbox button
    const cbBtn = document.createElement('button');
    if (doneIt == true) {
        cbBtn.innerHTML = '<img src="./images/checkbox-checked.PNG">';
    }
    else {
        cbBtn.innerHTML = '<img src="./images/checkbox-unchecked.PNG">';
    }
    cbBtn.setAttribute('id', 'toggle-id-' + id);
    myDiv.appendChild(cbBtn);
}

function createDeleteButton(id, myDiv) {
    //This is the delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<img src="./images/delete-icon-png-red.png">';
    delBtn.setAttribute('id', 'del-id-' + id);
    myDiv.appendChild(delBtn);
}

function createEditButton(id, myDiv) {
    //This is the delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<img src="./images/edit-button.png">';
    delBtn.setAttribute('id', 'edit-id-' + id);
    myDiv.appendChild(delBtn);
}

function createPTag(id, myDiv, txt) {
    const newPTag = document.createElement('p');
    newPTag.setAttribute('class', 'my-text');
    newPTag.setAttribute('id', 'ptag-id-' + id);
    newPTag.innerHTML = txt;
    myDiv.appendChild(newPTag);
}
function createDivContents(id, myDiv, txt, doneIt) {
    //Read the text and put it inside a p-tag
    createPTag(id, myDiv, txt);
    createEditButton(id, myDiv);
    createCheckboxButton(id, myDiv, doneIt);
    createDeleteButton(id, myDiv);
}

function buildActivitiesListStructure() {
    //We need to build the HTML nodes for every "activity" in our bucket list (i.e. element in the bucketListArr variable)
    //But we must start with the headlines for the activities
    let previousCategory = '';
    let catIndex=-1;
    for (let index = 0; index < bucketListArr.length; index++) {
        const newDivTag = document.createElement('div');
        //Create headline
        if (previousCategory != bucketListArr[index].catName) {
            catIndex++;
            const headline = document.createElement('h2');
            headline.innerHTML = bucketListArr[index].catName;
            startingPoint.appendChild(headline);
            
        }
        newDivTag.setAttribute('class', 'elementRow cat-color-' + catIndex);
        startingPoint.appendChild(newDivTag);
        createDivContents(bucketListArr[index].id, newDivTag, bucketListArr[index].description, bucketListArr[index].beenThereDoneThat);
        previousCategory = bucketListArr[index].catName;
    }
}

function refreshTheBucketList() {
    //We call the function every time we add or remove an item from the list.
    //We might also call it when we sort the list in a different way
    //and also when we load the page for the first time

    //Before we do the refresh, we need to remove the current children from our list,
    //otherwise we end up with duplicates
    startingPoint.innerHTML = '';
    buildActivitiesListStructure();
    createClickEventsForEditButtons();
    createClickEventsForCheckboxButtons();
    createClickEventsForDeleteButtons();
    //localStorage.clear();
    localStorage.setItem('bList', JSON.stringify(bucketListArr));
    updateAllCategoriesDropdown();
}

function createClickEventForToggle(id) {
    const cbButton = document.getElementById('toggle-id-' + id);
    cbButton.addEventListener('click', (event) => {
        //We update the element in the bucketListArr also, so that we are in sync with what is displayed in the list
        if (cbButton.innerHTML == '<img src="./images/checkbox-checked.PNG">') {
            bucketListArr[id].beenThereDoneThat = false;
            cbButton.innerHTML = '<img src="./images/checkbox-unchecked.PNG">';
        }
        else {
            cbButton.innerHTML = '<img src="./images/checkbox-checked.PNG">';
            bucketListArr[id].beenThereDoneThat = true;
        }
        //Finally, store this change in the local storage
        localStorage.setItem('bList', JSON.stringify(bucketListArr));
    });
}
function createClickEventsForCheckboxButtons() {
    for (let index = 0; index < bucketListArr.length; index++) {
        createClickEventForToggle(index);
    }
}
function createClickEventForDelete(id) {
    const delButton = document.getElementById('del-id-' + id);
    delButton.addEventListener('click', (event) => {
        //Remove tyhe corresponding item from the bucketListArr;

        //We will also need to re-index the list elements after the removed item,
        //as well as recreate the button events (to be in sync)
        removeBucketListElement(id);
    });
}
function createClickEventsForDeleteButtons() {
    for (let index = 0; index < bucketListArr.length; index++) {
        createClickEventForDelete(index);
    }
}
function createClickEventsForEditButtons() {
    for (let index = 0; index < bucketListArr.length; index++) {
        createClickEventForEdit(index);
    }
}

function reIndexBucketListItems() {
    for (let index = 0; index < bucketListArr.length; index++) {
        bucketListArr[index].id = index;
    }
}
function createClickEventForEdit(id) {
    const editButton = document.getElementById('edit-id-' + id);
    editButton.addEventListener('click', (event) => {
        //We need to open a form and put the description text of the corresponding element in it;
        let editField = document.getElementById('activityDescription');
        editField.value = bucketListArr[id].description;
        //No re-indexing is needed here because we don't do anything with the order
        // of the elements

        //But we need to know which of the elements we want to edit,
        //So we create a global variable to keep track of that
        idForEdit = id;
    });
}
function removeBucketListElement(index) {
    if (index > -1) { // only splice array when item is found
        bucketListArr.splice(index, 1); // 2nd parameter means remove one item only
    }
    //We also need to reindex the element's id (actually only the ones following the removed element)
    //but I skip thar logic here
    reIndexBucketListItems();
    //Show the new contents of our list
    refreshTheBucketList();
}

function initializeBucketList() {
    //In case we want to start with some external data, do this
    for (let index = 0; index < startingActivities.length; index++) {
        const elem = {
            id: index,
            beenThereDoneThat: startingActivities[index].beenThereDoneThat,
            catName: startingActivities[index].catName,
            description: startingActivities[index].description
        }
        addElementToOrderedCollection(elem);
    }
    refreshTheBucketList();
}

function updateAllCategoriesDropdown() {
    findAllCategories();
    //Remove the previous categories
    theSelectCat.innerHTML = '';
    for (let index = 0; index < categoriesFound.length; index++) {
        const newOption = document.createElement('option');
        newOption.setAttribute('Value', categoriesFound[index]);
        newOption.innerHTML = categoriesFound[index];
        theSelectCat.appendChild(newOption);
    }
}

function findAllCategories() {
    for (let index = 0; index < bucketListArr.length; index++) {
        if (!categoriesFound.includes(bucketListArr[index].catName)) {
            categoriesFound.push(bucketListArr[index].catName);
        }
    }
}
function findAllCategoriesForExistingActivities() {
    for (let index = 0; index < bucketListArr.length; index++) {
        if (!categoriesFoundBeforeInsertionOfNewActivity.includes(bucketListArr[index].catName)) {
            categoriesFoundBeforeInsertionOfNewActivity.push(bucketListArr[index].catName);
        }
    }
}

function sortElementsForCategoryName(catName) {
    //Start with finding the first element of this category
    //If there is none, or there is only 1 such element, then return
    let foundElements = 0;
    let firstOccurenceIndex = -1;
    for (let index = 0; index < bucketListArr.length; index++) {
        if (bucketListArr[index].catName == catName) {
            foundElements++;
            //We save the place where we first encounter en element of this category
            if (firstOccurenceIndex < 0) {
                firstOccurenceIndex = index;
            }
        }
    }
    if (foundElements <= 1) {
        return;
    }
    else {
        stopIndex = firstOccurenceIndex + foundElements;
        //We only reach this point if there are at least 2 elements of the same category
        for (let index = firstOccurenceIndex; index < stopIndex - 1; index++) {
            //We need to perform a string comparison of 2 adjecent elements
            //A couple of times. I just do it once because I am lazy
            if (bucketListArr[index].catName > bucketListArr[index + 1].catName) {
                //Switch places
                let temp = bucketListArr[index];
                bucketListArr[index] = bucketListArr[index + 1];
                bucketListArr[index + 1] = temp;
            }
        }
    }
}

function addElementToOrderedCollection(element) {
    //The easiest way to keep the elements ordered inside our bucket list is to place them
    //in order from the very beginning. The first element inserted can be added to the list
    //unconditionally, while the remaining elements will be added to their corresponding category
    //group, and at the end of it. Afterwards, an alphabetic order can be applied if so needed, inside
    //every category.
    findAllCategoriesForExistingActivities();
    const orderedElement = {
        id: 0,
        beenThereDoneThat: element.beenThereDoneThat,
        catName: element.catName,
        description: element.description
    };
    if (bucketListArr.length == 0) {
        //Insert the first element
        bucketListArr.push(orderedElement);
    }
    else {
        //Place the other elements inside correct category
        //If the element category is not in our current list, then push it to the end
        if (!categoriesFoundBeforeInsertionOfNewActivity.includes(element.catName)) {
            orderedElement.id = bucketListArr.length;
            bucketListArr.push(orderedElement);
            //categoriesFound.push(newCategoryEl.value);
            updateAllCategoriesDropdown();
        }
        else {
            //The category exist already, so add the element to the end of the correct category
            //using the insertionIndex to keep track of the position
            let insertionIndex = 0;
            for (let index = 0; index < bucketListArr.length; index++) {
                if (bucketListArr[index].catName == element.catName) {
                    //If we reached this point, we have detected an element with the right category
                    //The insertionIndex will stop changing once we reach an element with a new category
                    //and the next index position will be where we want to insert the new element
                    insertionIndex = index;
                }
            }
            let newIndex = insertionIndex + 1;
            orderedElement.id = newIndex;
            bucketListArr.splice(newIndex, 0, orderedElement);
            //We also need to re-index the elements following the newIndex
            for (let index = newIndex + 1; index < bucketListArr.length; index++) {
                bucketListArr[index].id = index;
            }
            //categoriesFound.push(newCategoryEl.value);
        }
        categoriesFoundBeforeInsertionOfNewActivity = [];
        sortElementsForCategoryName(element.catName);
    }
}

//---------------- Event listeners (start) ----------------------------------
const categoriesFormEl = document.getElementById('categoriesForm');
categoriesFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    //Only add a new category if the maximum allowed has not been reached
    if (categoriesFound.length == MAX_ALLOWED_CATEGORIES) {
        alert('The maximum allowed of ' + MAX_ALLOWED_CATEGORIES + ' has been reached! You can not create more')
        return;
    }
    if (!categoriesFound.includes(newCategoryEl.value)) {
        categoriesFound.push(newCategoryEl.value);
        updateAllCategoriesDropdown(newCategoryEl.value);
    }
});

const newDescriptionEl = document.getElementById('activityDescription');
newDescriptionEl.addEventListener('change', (event) => {

});

const editFormEl = document.getElementById('editForm');
editFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    bucketListArr[idForEdit].description = newDescriptionEl.value;

    //We also need to update the contents of the p-tag (so we won't have to reload the whole bucket list)
    const pTagEl = document.getElementById('ptag-id-' + idForEdit);
    pTagEl.innerHTML = newDescriptionEl.value;

    //Finally, update the local storage
    localStorage.setItem('bList', JSON.stringify(bucketListArr));
    // Reset form?
});


const nextActivityEl = document.getElementById('activityName');
nextActivityEl.addEventListener('change', (event) => {
});

const chosenCategoryEl = document.getElementById('activityCategory');
chosenCategoryEl.addEventListener('change', (event) => {
});

const registerFormEl = document.getElementById('addBucketListItemForm');
registerFormEl.addEventListener('submit', (event) => {
    event.preventDefault(); // förhindrar att sidan laddas om
    newBucketListItem = {
        id: 0,
        beenThereDoneThat: false,
        catName: chosenCategoryEl.value,
        description: nextActivityEl.value
    };

    addElementToOrderedCollection(newBucketListItem);
    // reset the input-field
    nextActivityEl.value = "";
    //Refresh the bucket list after a successfull submit
    refreshTheBucketList();
});
//---------------- Event listeners (end) ----------------------------------