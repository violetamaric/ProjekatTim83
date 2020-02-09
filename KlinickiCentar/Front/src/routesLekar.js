
import IzmenaProfila from "views/IzmenaProfila.jsx";
import ZahtevZaGodOdmor from "views/ZahtevLekar.jsx";
import PocetnaStranicaLekara from "views/PocetnaStranicaLekara.jsx";
import ListaPacijenata from "views/ListaPacijenataLekar.jsx";
// import Pregled from "views/Pregled.jsx";

const dashboardRoutes = [
  //za lekara
  {
    path: "/pocetnaStranica",
    name: "Pocetna Strana Lekara",
    icon: "pe-7s-home",
    component: PocetnaStranicaLekara,
    layout: "/lekar"
  },
  
  {
    path: "/listaPacijenataLekar",
    name: "Lista pacijenata",
    icon: "pe-7s-news-paper",
    component: ListaPacijenata,
    layout: "/lekar"
  },
  {
    path: "/izmenaProfilaLekara",
    name: "Izmena profila",
    icon: "pe-7s-user",
    component: IzmenaProfila,
    layout: "/lekar"
  },
  {
    path: "/zahtevLekar",
    name: "Zahtev za odmor odsustvo",
    icon: "pe-7s-date",
    component: ZahtevZaGodOdmor,
    layout: "/lekar"
  }
];

export default dashboardRoutes;
