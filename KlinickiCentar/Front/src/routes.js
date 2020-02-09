

import IzmenaProfila from "views/IzmenaProfila";
import TableList from "views/TableList.jsx";
import Typography from "views/Typography.jsx";
import Icons from "views/Icons.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import Upgrade from "views/Upgrade.jsx";
import KlinickiCentar from "views/KlinickiCentar.jsx";
import PocetnaStranicaLekara from "views/PocetnaStranicaLekara.jsx";
import ListaZahtevaAdminKC from "views/ListaZahtevaAdminKC.jsx";
import Sifrarnik from "views/Sifrarnik.jsx";

const dashboardRoutes = [
  //za admina KC
  {    
    path: "/klinickiCentar",
    name: "Klinicki Centar",
    icon: "pe-7s-graph",
    component: KlinickiCentar,
    layout: "/admin"
  },
  {    
    path: "/listaZahteva",
    name: "Zahtevi za registraciju",
    icon: "pe-7s-graph",
    component: ListaZahtevaAdminKC,
    layout: "/admin"
  },
  {    
    path: "/sifrarnik",
    name: "Šifrarnik",
    icon: "pe-7s-graph",
    component: Sifrarnik,
    layout: "/admin"
  },
  //za lekara 
  {
    path: "/pocetnaStranica",
    name: "Pocetna Strana Lekara",
    icon: "pe-7s-graph",
    component: PocetnaStranicaLekara,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Izmena profila",
    icon: "pe-7s-user",
    component: IzmenaProfila,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/admin"
  },
  {
    // upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "pe-7s-rocket",
    component: Upgrade,
    layout: "/admin"
  }
];

export default dashboardRoutes;
