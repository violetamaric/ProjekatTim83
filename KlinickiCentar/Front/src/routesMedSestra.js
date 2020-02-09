import IzmenaProfila from "views/IzmenaProfilaMedSestre.jsx";
import PocetnaStranicaMedSestre from "views/PocetnaStranicaMedSestre.jsx";
import ListaPacijenata from "views/ListaPacijenataMedSestra.jsx";
import OveravanjeRecepata from "views/OveravanjeRecepata.jsx";
import ZahtevZaGodOdmor from "views/ZahtevMedSestra.jsx";

const dashboardRoutes = [
  //za medicinsku sestru
  {
    path: "/pocetnaStranica",
    name: "Pocetna Strana Medicinske sestre",
    icon: "pe-7s-home",
    component: PocetnaStranicaMedSestre,
    layout: "/medses"
  },
  {
    path: "/listaPacijenata",
    name: "Lista pacijenata",
    icon: "pe-7s-news-paper",
    component: ListaPacijenata,
    layout: "/medses"
  },
  {
    path: "/overavanjeRecepata",
    name: "Overavanje recepata",
    icon: "pe-7s-pen",
    component: OveravanjeRecepata,
    layout: "/medses"
  },
  {
    path: "/izmenaProfila",
    name: "Izmena profila",
    icon: "pe-7s-user",
    component: IzmenaProfila,
    layout: "/medses"
  },
  {
    path: "/zahtevZaGodOdmor",
    name: "Zahtev za godisnji odmor",
    icon: "pe-7s-date", //note coffee
    component: ZahtevZaGodOdmor,
    layout: "/medses"
  }
];

export default dashboardRoutes;
