# levenshtein-distance-js


### APIs used form the testing:

- Microsoft Cognitive Speech

    * benefits: clear documentation, 30 days free trial
    * shortcomings: -
    * potential risks: -

- Speechmatics

    * benefits: clear documentation
    * shortcomings: the API is limited with specific amount of credit
    * potential risks: -

### Measure of accuracy algorithm

- levenshtein-distance


## How to install / use the tool

#### Global configuration
- install the necessary dependencies using:
            
      $ npm install
      
- in `./config/settings.js` change add the complete file path and the .xls transcription file 

#### Microsoft Cognitive Speech configuration


- create an account for Microsoft Cognitive and copy your subscription key

- add your subscription key to `./config/settings.js`

- specify the transcription language

#### Speechmatics configuration

- create an account for Speechmatics and add the user id and the authentication key
 to  `./config/settings.js`
 
- change the callbackurl to your server domain to get notification when the processing of the file finishes.

- specify the transcription language

- add the listening port

## Results


- Microsoft Cognitive Speech is more accurate and faster than Speechmatics API.
