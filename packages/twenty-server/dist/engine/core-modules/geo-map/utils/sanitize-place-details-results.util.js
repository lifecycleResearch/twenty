"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizePlaceDetailsResults", {
    enumerable: true,
    get: function() {
        return sanitizePlaceDetailsResults;
    }
});
const sanitizePlaceDetailsResults = (AddressComponents, location)=>{
    if (!AddressComponents || AddressComponents.length === 0) return {};
    const address = {};
    for (const AddressComponent of AddressComponents){
        for (const type of AddressComponent.types){
            switch(type){
                case 'postal_code':
                    {
                        address.postcode = AddressComponent.long_name + (address.postcode ?? '');
                        break;
                    }
                case 'postal_code_suffix':
                    {
                        address.postcode = (address.postcode ?? '') + '-' + AddressComponent.long_name;
                        break;
                    }
                case 'locality':
                    address.city = AddressComponent.long_name;
                    break;
                case 'postal_town':
                    if (!address.city) {
                        address.city = AddressComponent.long_name;
                    }
                    break;
                case 'administrative_area_level_3':
                    {
                        if (!address.city) {
                            address.city = AddressComponent.long_name;
                        }
                        break;
                    }
                case 'administrative_area_level_1':
                    {
                        address.state = AddressComponent.long_name;
                        break;
                    }
                case 'administrative_area_level_2':
                    {
                        if (!address.state) {
                            address.state = AddressComponent.long_name;
                        }
                        break;
                    }
                case 'country':
                    address.country = AddressComponent.short_name;
                    break;
            }
        }
    }
    address.location = location;
    return address;
};

//# sourceMappingURL=sanitize-place-details-results.util.js.map