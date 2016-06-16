app = app || {};

app.models.Movie = Backbone.Model.extend({
	defaults: {
		"ID": "",
		"Name": "",
		"Director": "",
		"description": "",
		"ImdbRating": "",
		"RatedR": ""
	},
	
	initialize: function() {
		var self = this;
		if(this.get('RatedR') === 'yes') {
			self.set('type', 'Rated-R');
		} else {
			self.set('type', 'Family');
		}
	}
	
});

app.collections.MovieList = Backbone.Collection.extend({
	
	model: app.models.Movie,
	
	comparator: function(movie) {
		return movie.get('moviename');
	}
	
});