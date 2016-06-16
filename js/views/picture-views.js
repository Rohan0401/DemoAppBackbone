app = app || {};

app.views.Movie = Backbone.View.extend({
	tagName: 'li',
	
	attributes: function() {
		return {
			class: 'picture ' + this.model.get('type')
		};
	},
	
	events: {
		'click .list-header': 'showDetails'
	},
	
	template: _.template($('#picture-template').html()),
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	showDetails: function(e) {
		$(e.target).toggleClass('active');
		$(e.target).siblings('.details').slideToggle('fast');
	}
	
});

app.views.MovieList = Backbone.View.extend({

	el: '#wrapper',
	
	initialize: function(data) {
		this.collection = new app.collections.MovieList(data);
		this.render();
		
		this.$el.find('#filters').append(this.createFilters());
		
		this.on('change:searchFilter', this.filterBySearch, this);
		this.on('change:filterType', this.filterByType, this);
		
		this.collection.on('reset', this.render, this);
	},
	
	events: {
		'keyup #searchBox': 'searchFilter',
		'click a.filter': 'setFilter'
	},
	
	render: function() {
		var self = this;
		$('#listing').empty();
		_.each(this.collection.models, function(movie) {
			self.renderMovie(movie);
		}, this);
	},
	
	renderMovie: function(movie) {
		var newmovie = new app.views.Movie({
			model: movie
		});
		$('#listing').append(newmovie.render().el);
	},
	
	getTypes: function() {
		return _.uniq(this.collection.pluck('type'));
	},
	
	setListLength: function(l) {
		$('#count').html(l);
	},
	
	createFilters: function() {
		var filters = '<a class="filter" href="#all">all</a>';
		_.each(this.getTypes(), function(item) {
			filters +=" " + '<a class="filter" href="#' + item + '">' + item + '</a>';
		});
		return filters;
	},
	
	searchFilter: function(e) {
		this.searchFilter = e.target.value;
		this.trigger('change:searchFilter');
	},
	
	setFilter: function(e) {
		e.preventDefault();
		this.filterType = e.currentTarget.innerHTML;
		this.trigger('change:filterType');
	},
	
	filterBySearch: function() {
		this.collection.reset(directoryData, {silent: true});
		var filterString = this.searchFilter,
			filtered = _.filter(this.collection.models, function(item) {
				return item.get('Name').toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
			});
		this.setListLength(filtered.length);
		this.collection.reset(filtered);
	},
	
	filterByType: function() {
		if(this.filterType === 'all') {
			this.collection.reset(directoryData);
			this.setListLength(this.collection.length);
			appRouter.navigate('filter/all');
		} else {
			this.collection.reset(directoryData, { silent:true });
			var filterType = this.filterType,
				filtered = _.filter(this.collection.models, function(item) {
					return item.get('type') === filterType;
				});
			this.setListLength(filtered.length);
			this.collection.reset(filtered);
			appRouter.navigate('filter/' + filterType);
		}
	}
	
});