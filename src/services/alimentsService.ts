
// Ce fichier est un point d'entrée pour tous les services liés aux aliments

import { fetchAliments, fetchAlimentById } from "./aliments/fetchAlimentsService";
import { searchAliments } from "./aliments/searchAlimentsService";
import { 
  filterAlimentsByCategory, 
  filterAlimentsBySeason, 
  filterAlimentsByHealthProperty 
} from "./aliments/filterAlimentsService";

export {
  fetchAliments,
  fetchAlimentById,
  searchAliments,
  filterAlimentsByCategory,
  filterAlimentsBySeason,
  filterAlimentsByHealthProperty
};
