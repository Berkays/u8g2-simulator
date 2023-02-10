import battery_signal from "bundle-text:./battery_signal.raw.cpp";
import ugly_bird from "bundle-text:./ugly_bird.raw.cpp";
import intro from "bundle-text:./intro.raw.cpp";
import weather_clock from "bundle-text:./weather_clock.raw.cpp";
import config_screen from "bundle-text:./config_screen.raw.cpp";
import ui_elements from "bundle-text:./ui_elements.raw.cpp";
import server_monitor from "bundle-text:./server_monitor.raw.cpp";
import drawGlyph from "bundle-text:./drawGlyph.raw.cpp";
import clock from "bundle-text:./clock.raw.cpp";

export interface CodeExample {
    name: string;
    code: string;
}

export const examples: CodeExample[] = [
    {
        name: "Intro",
        code: intro
    },
    {
        name: "Battery/Signal",
        code: battery_signal
    },
    {
        name: "Ugly Bird",
        code: ugly_bird
    },
    {
        name: "Weather / Clock",
        code: weather_clock
    },
    {
        name: "Config Screen",
        code: config_screen
    },
    {
        name: "UI Elements",
        code: ui_elements
    },
    {
        name: "Server Monitor",
        code: server_monitor
    },
    {
        name: "Draw Glyph",
        code: drawGlyph
    },
    {
        name: "Clock",
        code: clock
    }
];
