## u8g2-sim

This is an attempt to speed up UI development for Arduino projects using the U8G2 library ([https://github.com/olikraus/u8g2/](https://github.com/olikraus/u8g2/)).

You can see a running demo here: [https://p3dt.net/u8g2sim/](https://p3dt.net/u8g2sim/)

Hint: it is still very buggy. Please report bugs via github 👍

This is a lot of copy & paste from the original project u8g2.

## How to Develop

Clone this repo.

    npm install
    npm run build
    npm run start

The build step is required s.th. the dev server can pick up the static font files from `dist/`.

Open [http://localhost:8081/#](http://localhost:8081/#)
