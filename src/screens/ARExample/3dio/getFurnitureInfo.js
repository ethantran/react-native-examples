import callService from './callService';
import normalizeFurnitureInfo from './normalizeFurnitureInfo';

export default function getFurnitureInfo(id) {
    return callService('Product.read', { resourceId: id }).then(function(
        rawInfo
    ) {
        return normalizeFurnitureInfo(rawInfo);
    });
}
