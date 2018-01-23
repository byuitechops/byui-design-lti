# byui-design-lti
Designer tools via LTI rich text editor integration

## Environment Variables

You will need to set the following env vars to run the app

|Variable|Windows Code|Purpose|
|---|---|---|
|SESSION_SECRET|`set SESSION_SECRET=`|This key is used for session security|
|LTI_KEY|`set LTI_KEY=`|The LTI Key|
|LTI_SECRET|`set LTI_SECRET=`|The LTI Secret|

## How to Set Up Localhost

### Start Server
```
npm restart
```

### Tell Chrome to Accept Our Certificate 

Open the page below, click advanced, and click proceed anyway

```
https://localhost:1820
```

### Load the Dev Environment Variables in Your Console
Do this by running the commands above with the correct keys.

Example: `set LTI_SECRET=asldkjalk`


