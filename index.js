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


import {
  activateNestControl
} from "./parent_nest_control.js";


/*   start parent app*/

applyTimeAtmosphere();

buildCards();

activateCarousel();

activateSheet();

activateNavigation();

activateArrival();

activateNestControl();
