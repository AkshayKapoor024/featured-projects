mapboxgl.accessToken = mapToken;
var newcoordinates= []
if(coordinates.length==0){
    newcoordinates = [77.209, 28.613]
}else newcoordinates=[...coordinates]
console.log(newcoordinates)
const map = new mapboxgl.Map({
  container: 'map',
  center: newcoordinates,
  zoom: 9
});
const popupOffsets = {
  'top': [0, 25],
  'bottom': [0, -25],
  'left': [25, 25],
  'right': [-25, 0]
};

const popup = new mapboxgl.Popup({ offset: popupOffsets })
  .setHTML(`<h6>${listing.title}</h6>`);

const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(newcoordinates)
  .setPopup(popup)
  .addTo(map);

// Manually trigger popup on hover
const markerElement = marker.getElement();

markerElement.addEventListener('mouseenter', () => {
  popup.setLngLat(newcoordinates).addTo(map);
});

markerElement.addEventListener('mouseleave', () => {
  popup.remove();
});
