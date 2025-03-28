
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import PostAddIcon from '@mui/icons-material/PostAdd';

export const menuItems = [

  // {

  //   title: "Masters",
  //   path: '/master/customermaster',
  //   icon: <LibraryBooksIcon />,
  //   submenus: [],
  // },
  {
    title: "Masters",
    path: '/master',
    icon: <PostAddIcon />,
    submenus: [
      {
        title: "Customer Master",
        path: "/customermaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },


      {
        title: "Supplier Master",
        path: "/suppliermaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Product Master",
        path: "/productmaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Material Master",
        path: "materialmaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Account Master",
        path: "/accountmaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },

      {
        title: "User Master",
        path: "/usermaster",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },

    ],
  },
  {
    title: "Transaction",
    path: '/transaction',
    icon: <ReceiptIcon />,
    submenus: [
      {
        title: "Sales",
        path: "/salesentry",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Purchase",
        path: "/Purchase",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },

      {
        title: "Purchase Other",
        path: "/Purchaseother",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },

      {
        title: "Production Entry",
        path: "productionentry",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Delivery Challan At Godwon",
        path: "deliverychallan",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Inword at store",
        path: "inwordatstore",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Planning",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Receipts",
        path: "receipts",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Payments",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
    ],
  },

  {
    title: "Reports",
    path: '/commonpage',
    icon: <DescriptionIcon />,
    submenus: [
      {
        title: "Productwise Sales",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Customerwise Sales",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
      {
        title: "Stock Report",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },

      {
        title: "Account Receivable",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },


      {
        title: "Account Payable",
        path: "commonpage",
        icon: <FiberManualRecordIcon sx={{ fontSize: 15 }} />,
      },
    ],
  },




  {
    title: "Company Information",
    path: "commonpage",
    icon: <PermIdentityIcon />,
    submenus: [],
  },

  {
    title: "Settings",
    path: "/setting",
    icon: <SettingsIcon />,
    submenus: [],
  },

];
