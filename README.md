<h1 align="center">
   📸 Passport Scanner App using React Native (Typescript)
</h1>



Android based mobile app that automatically reads MRZ section of passport and provides the details and image within seconds and uploads data to remote server when online. This app works both in online and offline mode.

This project is specially designed for SIM distributor where we need **digital passports**, **passport details**, **user signature**, **mobile SIM/ICCID number** and finally the **sim guide image**. After the process is complete app sends datas and images into remote server. Later these datas are needed to be sent to the vendor from backend for activation process.

However I have included  the options to enable/disable these extended features (*beside passport details*) in the setting screen, These logic can be easily implemented or hooked upon small modification to meet your requirements.

The main components used on this app are :-

* **OCR ENGINE**: This is the core part of the project. Its a React Native wrapper for [Tesseract]((https://tesseract.projectnaptha.com/) ) which was made open source by **Google** . I have forked the package and modified the npm package [react-native-tesseract-ocr](https://www.npmjs.com/package/react-native-tesseract-ocr) to support version 4 training data sets (*previously supports version 3*)  which is used  in this project, also android code is modified to support targeted SDK version upto 32 (*previously 28*) and *type*script file to add other training data sets like mrz, ocrb and some lite versions.
* **React Native Camera**: This module is used for capturing photos and automatically scanning *CODE_128* barcode from sim image.
* **React Redux Toolkit**: Central State management with benefits of async actions dispatch.
* **Redux Persist**: Persisting Data to async storage so that no datas are lost at any point of time.
* **Cropper**:  [Image Cropper](react-native-image-crop-tools) is used to crop precisley height and width of MRZ if automatic OCR fails. This gives user a good chance to make it work before restarting the scanning process.
* **Push Notification**: One signal push notification is used to send messages to targeted user or to broadcast message
* **Server Upload**: if the device is in online mode, all the datas are uploaded asynchronously to the remote server.
* **Clean up**:  Images from the cache are cleaned up once the datas are uploaded to free up the space. Also uploaded passports from the list are cleaned up every 1 min to maintain lean redux store. Uploaded datas can be viewed in real-time from filter section.



---

### Installation

```shell
npm run android 
```

This command will build android bundle and launches metro server for development mode.

The above command will basically run this command from package.json

```
"build-android": "cd ./android && ./gradlew app:assembleDebug && ./gradlew installDebug && cd ../",
"android": "npm run build-android && (adb reverse tcp:8081 tcp:8081 || true) && react-native run-android",
```



---

### APP Workflow

<p align="center">
<img src="https://iili.io/hjiqZP.jpg" alt="Main App" />
</p>
<p align="center">
<img src="https://iili.io/hjPbZ7.md.jpg" alt="Main App"/>
</p>


1) **Login**: User Authentication screen, upon successful login user credentials are saved along with **JWT** **Token** and its expiry. App automatically re-logins the user in background with the same credential iff the token is expired. Thus maintaining the logged-in state all the time.
2) **HOME SCREEN**: User will be directed to Home Screen. All the available *draft* (incomplete passport form) and *completed form* are shown in this section. Completed forms are sent to server in layers and images are uploaded. Upon all uploads the datas are removed from the persistent store and CACHE MEMORY is freed up so that app stays lean and clean always. Incomple Passport form process begins where it was left to complete the process. 
3) **Passport Scanner**: Scanner Page with passport canvas overlay. We must align MRZ canvas just above the MRZ section and capture it. The overlay canvas is cropped and sent to OCR Engine. If it fails User will be redirected to **Cropper** screen. If success user will be redirected to **Signature** screen

4) **Cropper Screen**: If the OCR engine fails to read the MRZ section which can happen if the text is not clear or boundary is not properly aligned. User will be redirected to this screen. User can then select cropping boundary to the clear text. This will greatly increase the success rate.

5) **Signature Screen**: User will then redirected to this screen for customer signature.

6) **ICCID Scanner**: This screen will automatically scan the bar code of type *CODE_128* and get ICCID number, which will then be used to get MSSIDN and Reference ID from the remote server.

7) **Sim Image Screen**: Here user can take picture of sim network for future reference.

8) **Passport Detail Page**: User from Home Screen can now see the list of passports which is being uploaded. User can tap in the list and go to this page which has passport details, Images, Signature and the intermediate data from remote server. User can also delete the passport from this Screen (*only if upload action has not completed*) 

9) **Filter Option**: This option quickly filters list by draf only or show both (*completed + draft*) which is default. Also User can go to the uploaded passport list fetched from server.

10) **Uploaded List**: User can see the list of uploaded server from the server. Initially 10 Items is loaded which then fetches more upon scroll for pagination. 

11) **Settings Screen**: Username is displayed with logout options. This page has options to disable extended feature like ICCID Scanner, User Signature, Take Sim Image. If all the options are disabled App will then upload only passport details and passport image to the server. However the logics are yet not hooked in this project. One can easily implement this logic as per the requirement. Also you can select the app to run in development mode or environment mode which changes the baseURL for remote uploads.

    

---

### Redux Store (Types)

* **Auth State**

  ```
  interface StateType {
  	isProduction: boolean;
  	hasWifi: boolean;
  	loading: boolean;
  	errorMessage: string | undefined;
  	username: string;
  	password: string;
  	token: string;
  	expiry: number | undefined;
  }
  ```

* **User Passport**

  ```
  interface UserPassport { 
  	id: string;
  	details: Partial<ResultFields>;
  	serverDBId: number | undefined;
  	passportImage: string;
  	signatureImage: string;
  	highlandImage: string;
  	highlandId: string;
  	iccid: string;
  	simNumber: string;
  	status: "pending" | "success" | "failed";
  }
  
  interface ResultFields {
      documentNumber: string | null;
      documentNumberCheckDigit: string | null;
      documentCode: string | null;
      nationality: string | null;
      sex: 'male' | 'female' | 'nonspecified' | null;
      expirationDate: string | null;
      expirationDateCheckDigit: string | null;
      compositeCheckDigit: string | null;
      birthDate: string | null;
      birthDateCheckDigit: string | null;
      issueDate: string | null;
      firstName: string | null;
      lastName: string | null;
      issuingState: string | null;
      // td1 only
      optional1?: string | undefined;
      optional2?: string | undefined;
      // td2 only
      optional?: string | undefined;
      // td3 only
      personalNumber?: string | undefined;
      personalNumberCheckDigit?: string | undefined;
      // french national id only
      administrativeCode?: string | undefined;
      administrativeCode2?: string | undefined;
      // swiss driving license only
      languageCode?: string | undefined;
      pinCode?: string | undefined;
      versionNumber?: string | undefined;
  }
  ```

* **Sample Data for User Passport**: You can find 2 passport item complete and incomplete in /data/userPassport.ts

  ```
  {
  		details: {
  			issueDate: null,
  			birthDate: "900722",
  			birthDateCheckDigit: "2",
  			compositeCheckDigit: "2",
  			documentCode: "P",
  			documentNumber: "07---97",
  			documentNumberCheckDigit: "6",
  			expirationDate: "240217",
  			expirationDateCheckDigit: "0",
  			firstName: "ABHINAV",
  			issuingState: "NPL",
  			lastName: "PAUDEL",
  			nationality: "NPL",
  			personalNumber: "3",
  			personalNumberCheckDigit: "1",
  			sex: "male",
  		},
  		id: "0.4177035484256211",
  		passportImage:
  			"file:///data/user/0/rn.highland.project/cache/ImageManipulator/b4c79a35-1b68-437c-b90c-bf82d8fbbc03.jpg",
  		signatureImage:
  			"file:///data/user/0/rn.highland.project/cache/36d7f345-43c9-46cb-ae1b-c874252adf33.JPEG",
  		highlandImage:
  			"file:///data/user/0/rn.highland.project/cache/ImageManipulator/9676ba0c-b65a-4f2e-817c-266f05bcc086.jpg",
  		status: "pending",
  	},
  ```

  

---

### API 

For uploads there are 5 API's used. It can be modified in code to meet the requirement

1) **Login API**: In app username, password token and its expiry is stored to maintaind the state and for automatic login and maintain the auth state in app.

   ``` j
   API: api/login
   Method: POST
   Field (JSON): username, password
   
   Expected Response: (200)
   {
       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wxxxxxxxxxx2NrZXRzb2x1dGlvbi5vcmdcL2FwaVwvbG9naW4iLCJpYXQiOjE2NTQ3MDUwODAsImV4cCI6MTYxxxxxxxxxxxxmk2ZHhFQUkxIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.acz3guP38nPvwZvrOhBi6fONLYkxxxxxxxxxI"
   }
   
   Error Response: (404)
   {
       "message": "Username or Password is not valid."
   }
   ```

    

2) **ICCID validity check API**: After automatic ICCID scanner, App will reach to remote server to validate the number and get SIM number and Reference ID which is stored to upload data in passport details API.

   ```
   API: /api/valid-sim?token={{token}}&iccid=89427xxxxxx30699
   Method: GET
   Params: token, iccid
   
   Response (200): 
   {
       "id": 1,
       "highland_id": "D7400",
       "iccid": "8942702111227530699",
       "sim_no": "97431079986"
   }
   
   Error Response: (404)
   {
       "message": "Sim Number Not found"
   }
   ```



3) **Upload Details API**: This api uploads recognized  text to the server.

   ```
   API: api/sim-distribute?token={{token}}
   Method: POST
   fields (JSON): highland_id, full_name, sex, dob, sim_number, icid_number, expiry_passport, company_name, passport_number
   
   Response: 
   {
       "id": 371,
       "message": "Successfully Saved!!"
   }
   ```

   

4) **Image Upload API**: Finally after getting the server ID from above API. Images are uploaded asynchronously 

   ```
   API: /api/upload-images?token={{token}}
   Method: POST
   
   Field (Multi Part FORM-DATA): 
   {
   	id: string,
   	signature_image: IMAGE FILE (Blob)
   	passport_image: IMAGE FILE (Blob)
   	sim_image:  IMAGE FILE (Blob)
   }
   ```

   

5. **Fetch Uploaded Passport**: This api fetches the details of uploaded passports.

   ```
   API: api/uploaded-data?page=23&token={{token}}
   Method: GET
   
   Response:
   {
       "lastPage": 24,
       "currentPage": 23,
       "perPage": 10,
       "data": [
           { ...}, {...} //user passoprt details
       ]
    }
   ```

   

---

### Environment (.env)

Remote Server domain and push notification App ID are stored in env file

```
REACT_APP_PRODUCTION_API_URL=
REACT_APP_API_DEVELOPEMENT_URL=
REACT_APP_ONE_SIGNAL_APP_ID=
```



---

### Development / Production Mode

You can switch between development mode and production mode in the settings screen. You need to restart the app the after making the switch for it to activate properly. In development REACT_APP_API_DEVELOPEMENT_URL url from .env file will be used whereas in production mode REACT_APP_PRODUCTION_API_URL url from .env file will be used.



---

### Testing Mode

This app can be easily tested without the remote server. Remote upload will not work as the token will be invalid. But in app features will be accessible. For that **shouldFakeState** flag should be set to true during dispatch of login action in the file /screens/LoginScreen.tsx at line *27*

```
const auth = await dispatch(
	getAuthToken({ username, password, shouldFakeState: true })
);
```



---

###  WHAT COULD BE IMPROVED

* to support latest version of tesseract with version 5 trainng data with enhanced speed and accuracy. Unfortunately no one has developed RN bridge to lateste android tesseract project. Please check android project [Tesseract4Android](https://github.com/adaptech-cz/Tesseract4Android)
* Detecting the MRZ section bounding rect automatically would be great. I have not found any easy tools for JS library to detect the bounding rect of an object. Looks like the wrapper project such as OPEN CV is under developed and the bundle size is huge around ~400MB. Please check this [link](https://brainhub.eu/library/opencv-react-native-image-processing)
