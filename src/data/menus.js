import { faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import {
  faTachometer,
  faTable,
  faLock,
  faNoteSticky,
  faNotdef,
  faDatabase,
  faShare
} from "@fortawesome/free-solid-svg-icons";

const initMenu = [
  {
    label: "Dashboard",
    path: "/",
    icon: faTachometer,
  },
  {
    label: 'Halaman'
  },
  {
    label: "Master Data Voucher",
    path: "/MasterDataUser",
    icon: faDatabase,
  },
  {
    label: "Master Data Partisipan ",
    path: "/MasterDataBanner",
    icon: faDatabase,
  },
  {
    label: "Master Data Pemenang ",
    path: "/MasterDataPemenang",
    icon: faDatabase,
  },
  // {
  //   label: "Result ",
  //   path: "/ListKajianTable",
  //   icon: faDatabase,
  // },

 
  // {
  //   label: "Kirim WhatsApp",
  //   path: "/kirim",
  //   icon: faShare,
  // },
  
  // {
  //   label: "Master Perlengkapan",
  //   path: "/table",
  //   icon: faTable,
  // },

  // {
  //   label: 'Otentikasi'
  // },
  // {
  //   label: "Login",
  //   path: "/auth/login",
  //   icon: faLock,
  // },
  
];

export default initMenu