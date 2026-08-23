import {
  applyTimeAtmosphere
} from "./parent_time.js";


import {
  buildCards,
  activateCarousel
} from "./parent_carousel.js";


import {
  activateSheet
} from "./parent_sheet.js";


import {
  activateNavigation
} from "./parent_navigation.js";


import {
  activateArrival
} from "./parent_arrival.js";


/* ==================================================
   START PARENT APP
   ================================================== */

applyTimeAtmosphere();

buildCards();

activateCarousel();

activateSheet();

activateNavigation();

activateArrival();
