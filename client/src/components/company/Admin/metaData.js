export const navigationData = [
  {
    name: "Contracts",
    color: "#718355",
    post_url: "admin/stage",
    redirection_url: "/marketplace",
    validate_url: "admin/validate-data",
    staged_list_get: "admin/stage",
    final_upload_url: "marketplace/agreement",
  },
  {
    name: "Farmers",
    color: "#FCBF49",
    post_url: "admin/farmer/stage",
    redirection_url: "/farmers",
    validate_url: "admin/farmer/validate",
    staged_list_get: "admin/farmer/stage",
    final_upload_url: "admin/farmer",
  },
  {
    name: "Farms",
    color: "#F77F00",
    post_url: "marketplace/agreement",
    redirection_url: "/marketplace",
    validate_url: "admin/validate-data",
    staged_list_get: "admin/farmer/stage",
    final_upload_url: "admin/farmer",
  },
];
