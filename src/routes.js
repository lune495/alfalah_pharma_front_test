
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import { Vente } from "views/vente/Vente";
import { ListAppro } from "views/appro/ListAppro";
import { Boutique } from "views/produit/Boutique";
import { Stock } from "views/stock/Stock";
import { User } from "views/user/User";
import { Setting } from "views/Setting/Setting";
import { Proformat } from "views/Proformat/Proformat";
import { Inventaire } from "views/Inventaire/Inventaire";
import { BonLivraison } from "views/bonLivraison/BonLivraison";
import { BonRetour } from "views/bonRetour/BonRetour";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-bar-chart",
    component: Dashboard,
    layout: "/admin"
  },

  {
    path: "/vente",
    name: "Vente",
    icon: "fa fa-shopping-cart",
    component: Vente,
    layout: "/admin"
  },
  {
    path: "/bon-retour",
    name: "Bon retour",
    icon: "fa fa-indent",
    component: BonRetour,
    layout: "/admin"
  },
  {
    path: "/produit",
    name: "Produits",
    icon: "fa fa-tag",
    component: Boutique,
    layout: "/admin"
  },
  
  {
    path: "/appro",
    name: "Appro",
    icon: "fa fa-line-chart",
    component: ListAppro,
    layout: "/admin"
  },
 
  {
    path: "/inventaire",
    name: "Inventaire",
    icon: "fa fa-indent",
    component: Inventaire,
    layout: "/admin"
  },
  {
    path: "/bonlivraison",
    name: "Bon Livraison",
    icon: "fa fa-shield",
    component: BonLivraison,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Utilisateur",
    icon: "fa fa-user",
    component: User,
    layout: "/admin"
  },
  {
    path: "/parametre",
    name: "Paramètre",
    icon: "fa fa-cog",
    component: Setting,
    layout: "/admin"
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   path: "/user-page",
  //   name: "User Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: UserPage,
  //   layout: "/admin"
  // },


];
export default routes;
