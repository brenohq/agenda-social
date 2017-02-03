Template.media.helpers({
	parseStartTime() {
		let date = new Date(this.item.start_time).toLocaleString();

		return date;
	}
});

Template.media.events({
	'click .checkbox': (e) => {
		let event = Blaze.getData(e.target).item;

		console.log(event)
		
		Events.update(event._id, { $set: { selected: !event.selected }})
	}
});