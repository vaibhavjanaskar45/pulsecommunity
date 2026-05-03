const providers = {
  maptiler: {
    url: `${process.env.REACT_APP_MAPTILER_API}`,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors ' +
      '&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
  }
};

export default providers;
