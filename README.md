# fr-dictionary


# updates

v0.01 - initial upload and functionality

v0.02 - update to readme

v0.021 - add analytics


# overview

Data retrieved from Duolingo for a user and progress and lessons for their current language, a user's word list with word strength and topic word introduced in.
Using a temp javascript script, parse the word list from JSON data into a series of simple arrays (max 200 words each)
Query the endpoint for translation hints in Duolingo (hover over a word then edit and resend the query with array of 200 words) to retrieve translation terms for all words.
Compile retrieved translations into one file. Functional, but only for demo purposes - produces an unwieldy file that is not fit for production purposes.

Import data and add to scrollable list - noting change between each letter.
Manually create array of alphabet letters, then use to create buttons to scroll to words with desired start letter. 

Clicking words, brings up word definitions and is cross referenced with translation array to show English translations.
Within each word object is the root lexeme and list of associated lexemes. Use list to search word list for similar words and add to result to enable switching between tenses, genders etc.


# plans - out of scope for quick code demo, but the initial idea, and elements I plan to carry on and implement

Mobile styling

Create three sections, *Language paths,* *Lessons* and *Dictionary*
Link topic the word is found in to a topic overview area (Lessons).

Lesson section to show break down of all topics, words contained and guidance notes.
Sample user progress against lesson to be shown.
Dependent lessons is included in data. These will be shown and allow the user to quickly visit the lesson overview of those earlier lessons. (similar to related words list in Dictionary)

Language paths
Reverse engineer sentences to discover which words / the percentage for that sentence that is taught within Duolingo / and how much the sample user has learned.
The topics required and their dependencies (and subsequent dependencies) are show to allow users to see all lessons required to gain knowledge of sample sentence.
Rating of comprehension of sentence based on above criteria

Dictionary
Add search.
Parse data again to create English to French dictionary (obviously limited in scope and with less available data for English words, but an interesting exercise)

Re-factor before adding multiple sections. Possibly reformat using Bootstrap. Replace static CSS with SASS


# known issues

Some words do not provide translation on clicking - need to manually check if data is different for such words.
Mobile styling not in place.
Word list behaving oddly on mobile - not yet debugged. (potentially due to unwieldy size of source data)