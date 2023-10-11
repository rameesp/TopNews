## Top News
Welcome to Top News 
## APP LINK : https://drive.google.com/file/d/1VM3hn4XV9XlpLdAZsXSwOoUBwAkIWDUN/view?usp=sharing
## Caching and Data fetching
API used : https://newsapi.org/

1. On Splash screen we will dispatch an action to redux for API call
2. In redux, i have implemented a custom middleware which will check weather the data is available in the local or not , if the data is available in the local it will fetch the data from the local or it will make an API request 
3. If we don't want to fetch the data from the local we can pass a parameter called invalidateCache to disable the data fetching from local / we can simply clear the storage 
4. I have used MMKV for storing the data in the storage which is key value pair storage

Initially i thought of moving with sqlite db by completely ditching the redux .

## why i didn't used sqlite 
Initially i started with sqlite, then i moved to redux and MMKV

Why i didn't used sqlite.

1. I don't want whole functionality of the app to be dependent on one package
2. what we want to move the whole operation to backend  instead of doing all the data manipulation in local , like pinning , deleting , updating watched or not ..., so i added MMKV to act as a cache for the redux 

## Redux store structure
There are three bucket in the redux

1. All Article : to load the all fetched data 
2. Visible List : it will act as a queue ,  all random generated data which we want to show to user will be stored here also also initial data which we want to show it to user
3. Pinned list : it will hold all pinned items 

Redux functionality 
-------------------------------------------------------------->

On initial fetching

1. After fetching the data it will move all item to  'all article list'
2. Then we filter the data based on pinned status and visited status 
3. If filtered by visited status is not empty it will move to 'visible list' as initial data.
4. If filtered by visited status is empty then we will get the top n number of items and moved to 'visible list' and update visited status to true in 'all article list'
5. All Items with pinned status will move to 'pinned list'
6. Update the storage

On Random data generation 

1. After every n seconds we will dispatch an action to redux for generating a collection random n elements 
2. In redux reducer will first get the items from 'all article list' which are not visited 
3. Then we will generate n number of random indices 
4. Based on random indices we will create an array of random n elements and add it to 'visible list'
5. We will update status of those added element as visited in  'all article list'
6. Update the storage

On Pin 

1. We will get the index of item from 'visible list' 
2. Update its status as pinned and add it to the 'pinned list'
3. Delete the element from the 'visited list'
4. Update the status on 'all article list'
5. Update the storage

On unpin 

1. We will get the index of item from the 'pinned list
2. Remove the data from 'pinned list' and move it 'visible list' and set pinned status to false
3. Update the item on 'all article list'
4. Update the storage

On delete

1. We check the item in 'all article list' , 'visible lst' and 'pinned list'
2. Delete the item from all the lists where the item is available
3. Update the storage 

## App component

1. List View FlatList : to show the list of news to user 
2. Queue status FAB button : to show available item in the queue : on Clicking of it, it will move all the available item in queue to the local state which will show in the list , if no data available in the queue , it will clear the timer and generate random items and add it the queue
3. Fetch from api button on App Bar : on click of this it will clear all the list and local storage then fetch new data from API
4. Refresh icon on App Bar :  on click of it , it will clear the timer then it will  generate random items from the'all article list' and add it the queue / visible list 
5. On End Reached Snack Bar : when end of FatList is reached  , if user has watched all the items , we will prompt the user to fetch the new data 

## Note ##

All the extra functionality i have added to the app by keeping in mind that it should be justice to both the requirement and to the end user 

