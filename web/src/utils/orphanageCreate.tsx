import React from "react";

  interface Orphanage {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: string;
  }

export default Orphanage;
