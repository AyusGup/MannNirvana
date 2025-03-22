import React from "react";
import { Calendar, MapPin } from "lucide-react";

const EventCard = ({ event }) => {
 
    const goToExternalSite = () => {
      window.open(event.href, "_blank", "noopener,noreferrer");
    };
  return (
    <div className="w-[280px] bg-white rounded-2xl shadow-lg p-3 border-dark border-2 h-[55vh] " onClick={goToExternalSite}>
      {/* 📌 Top Image Section */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-[25vh] object-cover"
        />
        {/* 📅 Date Badge */}
        <div className="absolute bottom-1 right-1 bg-slate-100 bg-opacity-70 block rounded-lg text-center shadow-md p-1">
          <p className="text-sm font-semibold text-extradark">{event.date.day +" "+ event.date.month}</p>
          {/* <p className="text-md font-bold text-extraDark">{}</p> */}
        </div>
      </div>

      {/* 📄 Event Details */}
      <div className="p-3 h-[15vh]">
        <h3 className="text-lg font-bold text-gray-900">

          {event.name} <span className="text-dark">✔</span>

        </h3>
        <p className="text-sm text-gray-600">
          {event.organizer.slice(0,50)+".."}
        </p>

      </div>
        {/* 📍 Location & Distance */}
        <div className=" bottom-4 mt-3 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-purple-600 font-semibold">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{event.location}</p>
          </div>
         {event.distance&& <p className="text-orange-500 font-bold text-sm">{event.distance} km</p>}
        </div>
    </div>
  );
};

export default EventCard;
