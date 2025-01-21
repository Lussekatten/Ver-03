I started with the assumption that some external data could be read and populate our bucket list from the very beginning.
This data is inside the array startingActivities.
I also added the possibility to create new categories to a maximum of 4. Once created, they cannot be modified.
When a new item is added to the bucket list, it will end up at the end of an existing category or at the end of the list, if the item's category is new (compared to existing items).
The bucket list items can be edited, marked/checked or deleted. The checking/unchecking is performed by changing an image and not using an actual form. I found the solution easier and more fun to implement.
When trying to edit the description for a bucket list item, the form can be found at the end of the list (don't say you could not find it). :)
The data is stored in localStorage for later access.

And yes, I connected to some basic features of Bootstrap (because I dislike ugly designs)
