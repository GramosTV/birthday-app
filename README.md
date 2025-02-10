# Birthday App

This is a React Native application for managing birthdays. The app allows users to add, edit, and browse birthdays, and it provides notifications for upcoming birthdays.

## Features

- Add new birthdays with details such as name, surname, notes, date, budget, color, and photo.
- Edit existing birthdays.
- Browse upcoming birthdays.
- Search for birthdays by name or surname.
- Export birthdays as JSON or CSV.
- Receive notifications for upcoming birthdays.

## App Showcase

Here are some GIFs showcasing the app:

### Adding a Birthday

![Adding a Birthday](1.gif)

### Layout

![Layout](2.gif)

### Search & Edit

![Search & Edit](3.gif)

### Export to CSV

![Export to CSV](4.gif)

## Project Structure

```
.
├── .expo/
├── android/
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── fonts/
│   │   ├── Bold.ttf
│   │   └── Regular.ttf
│   ├── icon.png
│   └── splash.png
├── components/
│   ├── Birthday.tsx
│   ├── BirthdayPage/
│   │   ├── BirthdayPage.tsx
│   │   └── QuickNote.tsx
│   ├── Browse/
│   │   ├── Browse.tsx
│   │   └── BrowseBirthday.tsx
│   ├── Create.tsx
│   ├── Edit.tsx
│   ├── MainPage/
│   │   ├── Birthdays.tsx
│   │   ├── Buttons.tsx
│   │   ├── Calendar.tsx
│   │   └── MainPage.tsx
│   ├── Nav.tsx
│   ├── Search/
│   │   ├── Search.tsx
│   │   └── SearchBirthday.tsx
│   └── Searcher.tsx
├── utils/
│   ├── AsyncStorage.ts
│   └── Misc.ts
├── types/
│   └── index.ts
├── App.tsx
├── app.json
├── babel.config.js
├── eas.json
├── package.json
└── tsconfig.json
```

## Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/birthday-app.git
cd birthday-app
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm start
```

## Running on Android

```sh
npm run android
```

## Running on iOS

```sh
npm run ios
```

### Notifications

The app uses Expo Notifications to schedule birthday reminders. Ensure you have the necessary permissions set up on your device.

### Exporting Birthdays

You can export birthdays as JSON or CSV by clicking the export button on the main page.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any inquiries, please contact [gramowskimikolaj@gmail.com](gramowskimikolaj@gmail.com).
