export const navigationData = [
  {
    name: "Contracts",
    color: "#718355",
    post_url: "admin/stage",
    redirection_url: "/marketplace",
    validate_url: "admin/validate-data",
    staged_list_get: "admin/stage",
    final_upload_url: "marketplace/agreement",
    get_list: "admin/listagreements",
    type: "agreement",
    search_text: "Search by crop and name",
    video_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/VideoTemplate/ContractVideo.mp4"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/videos/HowToUpload/Contracts/ContractVideo.mp4",
    csv_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/AgreementsTemplate.csv"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/files/DownLoadTemplate/AgreementsTemplate.csv",
  },
  {
    name: "Farmers",
    color: "#FCBF49",
    post_url: "admin/farmer/stage",
    redirection_url: "/farmers",
    validate_url: "admin/farmer/validate",
    staged_list_get: "admin/farmer/stage",
    final_upload_url: "admin/farmer",
    get_list: "admin/farmers",
    type: "farmer",
    search_text: "Search by phone number, name and pin",
    video_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/VideoTemplate/FarmerVideo.mp4"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/videos/HowToUpload/Farmer/FarmerVideo.mp4",
    csv_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/FarmerTemplate.csv"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/files/DownLoadTemplate/FarmerTemplate.csv",
  },
  {
    name: "Farms",
    color: "#F77F00",
    post_url: "admin/farm/stage",
    redirection_url: "/farms",
    validate_url: "admin/farm/validate",
    staged_list_get: "admin/farm/stage",
    final_upload_url: "admin/farm",
    get_list: "admin/farms",
    type: "farm",
    search_text: "Search by name and pin",
    video_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/VideoTemplate/FarmVideo.mp4"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/videos/HowToUpload/Farm/FarmVideo.mp4",
    csv_url:
      process.env.REACT_APP_ENV == "development"
        ? "https://samplevideoyoutube.s3.ap-northeast-1.amazonaws.com/ImportTemplate/farmTemplate.csv"
        : "https://agritrust.s3.ap-south-1.amazonaws.com/files/DownLoadTemplate/farmTemplate.csv",
  },
];
