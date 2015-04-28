# T-Square Mobile

A hybrid mobile application that brings the best of T-Square to your mobile device of choice. Quickly browse through your announcements and assignments, keep track of what's due with the intelligent dashboard, and effortlessly add any announcement or assignment to your dashboard so you'll never forget.

## Release Notes

This project is currently in alpha, and more of a proof-of-concept than a production-ready app. We made this for our Junior Design project class at Georgia Tech.

### Features

**Classes** - quickly view a list of all the classes you're currently taking.

**Announcements** - view all of your T-Square announcements sorted from newest to oldest. Or, tap on `class_name -> announcements` to view announcements specific to a class. Full HTML is supported for announcements, so you won't miss anything.

**Assignments** - quickly navigate through all pending assignments on the dashboard or assignments screen, or drill down into a class `class_name -> assignments` to view assignments specific to that class. Just like the announcements view, assignments support full HTML.

**Dashboard** - a summary view of all the assignments for all of your classes, sorted in priority order. Due dates are also color coded (red means due soon, orange means urgent, green means not due for awhile), and the due dates themselves are friendly (e.g., "in 2 days" as opposed to 05/23/2015).

### Known bugs and issues

Theoretically, tsquaremobile should be able to work on any platform supported by the Ionic Framework and Cordova. In practice, however, we've run into compatibility issues with the `InAppBrowser` Cordova extension on platforms other than iOS. While there are workarounds for this issue, we did not have time to implement these changes during the semester.

Additionally, it is not currently not possible to refresh T-Square data without first logging out, then logging back in again. This is due to a restriction with the API that we're using. If the T-Square API is updated to support sessions and adds more robust API endpoints, we could implement so-called "pull to refresh" or other means of refreshing data in the app without logging out first.

## Installation Instructions

This installation guide is for developers.

First, install [Node.js](https://nodejs.org/), if you haven't already; it's necessary to build our app.

To ensure you have everything installed correctly, open up your terminal and run:

```
$ which node npm
```

Note: The `$` means this is a terminal command; you should ignore the `$` actually type in `which node npm`.

If the console prints out something, you have installed Node.js and npm successfully. If it doesn't do anything, you need to try installing it again.

Next, install the Ionic CLI. Do so by running this command:

```
$ npm install -g cordova ionic
```

Confirm that Ionic has installed itself by executing this command"

```
$ ionic -v
```

As of this writing, the latest Ionic version was `1.3.18`. However, newer versions should work just fine.

If you haven't already, go ahead and clone this repo on your machine. Then in your terminal, change the directory to be inside the `tsquaremobile` git directory. For example, if you cloned the project to your Desktop, you would run:

```
$ cd Desktop/tsquaremobile
```

## Debugging in your web browser

Ionic allows you to run your app in your browser. You can then use  your developer tools of choice (I exclusively use the Chrome Developer Tools) to debug your app just like any other web app.

```
$ ionic serve
```

---

Note: for this project, we are using the Phonegap [InAppBrowser](http://docs.phonegap.com/en/edge/cordova_inappbrowser_inappbrowser.md.html) (follow the instructions there to install it), which only works when running on a mobile device (Android or iOS, for example).

Since we're using InAppBrowser to log the user into T-Square and retrieve their data, you need to first compile the app and run it in an emulator or on a device to test any change, which is slow.

Instead, to quickly test and flesh out features that don't depend on native API's, we have provided some mock data in `dsquare.json`, which you can pull into the `TSquare` service to bypass the InAppBrowser completely.

## Testing in an emulator

The setup for this largely depends on the device you're trying to emulate. For iOS, the process is quite simple.

```
$ ionic platform add ios
$ ionic emulate ios
```

The first command tells Ionic to prepare tsquaremobile for `iOS` development. Then, the second fires up the iOS emulator and launches the app automatically.

Note: You will need a Mac and have the iOS SDK installed before this will work. Ionic is quite helpful in this regard, however, and will give you instructions for how to proceed.

## Testing on a real device

Make sure you have your phone plugged into your computer (if you have Android, you may need to enable Developer Mode to before continuing). Then run:

```
$ ionic run <os>
```

Where `<os>` should be sustituted with `android`, `ios`, depending on the phone you've plugged into your computer. Please consult the Ionic developer guide for information on all supported platforms.