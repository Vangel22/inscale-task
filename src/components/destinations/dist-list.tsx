"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { notifyError } from "@/utils/notify";
import axios from "axios";
import Image from "next/image";

import style from "./Destinations.module.css";

interface Destination {
  name: string;
  slug: string;
  code: string;
  thumbnail: string;
  countHotels: number;
  countDestinations: number;
  destinations: [];
}

const DestinationsList = () => {
  const [destinations, setDestinations] = useState([]);
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(
        "https://book.tripx.se/wp-json/tripx/v1/destinations",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setDestinations(res.data);
      }
    } catch (err: any) {
      console.log("error", err);
      notifyError(err.response?.data || err.response.statusText || "Error");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className={style.destinationList}>
      <h2>List of Destinations</h2>
      {code && <h4>Booking code: {code}</h4>}
      <div className={style.cardsContainer}>
        {destinations.map((destination: Destination) => (
          <div className={style.card} key={destination.code}>
            <div className={style.thumbnail}>
              <Image
                height={100}
                width={100}
                src={destination.thumbnail}
                alt="thumbnail"
              />
            </div>
            <div className={style.destinationInfo}>
              <p>{destination.name}</p>
              <p>Hotels: {destination.countHotels}</p>
              <p>Destinations: {destination.countDestinations}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsList;
