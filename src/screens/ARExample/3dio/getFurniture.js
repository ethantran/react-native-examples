import getFurnitureInfo from './getFurnitureInfo';
import loadData3d from './loadData3d';

export default async function getFurniture(id) {
    // we need to call furniture info first in order to obtain data3d URL
    const info = await getFurnitureInfo(id);
    const data3d = await loadData3d(info.data3dUrl, {
        loadingQueuePrefix: 'interior'
    });
    return {
        // contains lightweight metadata like designer name and description
        info: info,
        // contains geometry and material definitions
        data3d: data3d
    };
}
