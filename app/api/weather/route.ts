import { NextResponse } from "next/server";

const LAT = 25.0804;
const LON = 55.1367;

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        demo: true,
        temp: 29,
        feelsLike: 31,
        humidity: 48,
        wind: 12,
        description: "Clear Sky",
        icon: "01d",
        location: "Dubai",
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`,
      {
        next: {
          revalidate: 1800, // 30 dakika cache
        },
      }
    );

    if (!response.ok) {
      throw new Error("Weather API request failed.");
    }

    const weather = await response.json();

    return NextResponse.json({
      success: true,

      temp: weather.main.temp,

      feelsLike: weather.main.feels_like,

      humidity: weather.main.humidity,

      wind: Math.round(weather.wind.speed * 3.6), // m/s -> km/h

      description: weather.weather[0].description,

      icon: weather.weather[0].icon,

      location: weather.name,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve weather information.",
      },
      {
        status: 500,
      }
    );
  }
}
