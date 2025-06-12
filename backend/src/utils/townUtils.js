const townsData = require("../data/cameroon_cities_clean.json");

class TownUtils {
  static getAllTowns() {
    return townsData.map((town) => ({
      name: town.city,
      region: town.region,
      coordinates: {
        latitude: town.latitude,
        longitude: town.longitude,
      },
    }));
  }

  static getTownByName(townName) {
    const town = townsData.find(
      (t) => t.city.toLowerCase() === townName.toLowerCase()
    );
    if (!town) return null;

    return {
      name: town.city,
      region: town.region,
      coordinates: {
        latitude: town.latitude,
        longitude: town.longitude,
      },
    };
  }

  static validateTowns(townNames) {
    if (!Array.isArray(townNames)) return false;

    const validTowns = townsData.map((t) => t.city.toLowerCase());
    return townNames.every((town) => validTowns.includes(town.toLowerCase()));
  }

  static getTownsByRegion(region) {
    return townsData
      .filter((town) => town.region.toLowerCase() === region.toLowerCase())
      .map((town) => ({
        name: town.city,
        region: town.region,
        coordinates: {
          latitude: town.latitude,
          longitude: town.longitude,
        },
      }));
  }
}

module.exports = TownUtils;
