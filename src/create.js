/**
 * @class yootil.create
 * @static
 * Contains useful methods to creating things quickly (i.e containers).
 */

yootil.create = class {

	/**
	 * Creates ProBoards div containers.
	 *
	 * Example:
	 *
	 *     let $container = yootil.create.container({
	 *
	 *        title: "My Title",
	 *        content: "My Content",
	 *        h2: true
	 *
	 *     });
	 *
	 *     $("#content").prepend($container);
	 *
	 * @param {String} $0.title Title of the container.
	 * @param {Boolean} [$0.h2] If set to true, it will not wrap the title with an h2 tag.
	 * @param {String} $0.content Content of the container
	 *
	 * @return {Object} jQuery
	 */

	static container({title = "", h2 = true, content = ""} = {}){
		let html = "";

		title = (!h2)? title : ("<h2>" + title + "</h2>");

		html += "<div class=\"container\">";
		html += "<div class=\"title-bar\">" + title + "</div>";
		html += "<div class=\"content pad-all\">" + content + "</div>";
		html += "</div>";

		return $(html).show();
	}

	/**
	 * Quickly create a blank page that matches a certain URL.
	 *
	 *     yootil.create.page({pattern: "shop", title: "Shop"});
	 *
	 * An example adding a container to the page:
	 *
	 *     yootil.create.page({pattern: "shop", title: "Shop"}).container("The Shop", "Welcome to the Shop").appendTo("#content");
	 *
	 * @param {String|Object} $0.pattern This will get matched against the location.href value, can be a string or RegExp object.
	 * @param {String} [$0.title] Gets Added onto the current document title.
	 * @param {Boolean} [$0.hide_content] By default the children of #content gets hidden, you can override this.
	 * @chainable
	 */

	static page({pattern = null, title = "", hide_content = true} = {}){
		if(!pattern){
			return this;
		}

		let reg = (pattern.constructor == RegExp)? pattern : new RegExp("\/\?" + pattern, "i");

		if(pattern && location.href.match(reg)){
			if(typeof title != "undefined" && title.length){
				document.title += " - " + title;
			}

			if(typeof hide_content == "undefined" || hide_content){
				$("#content").children().hide();
			}
		}

		return this;
	}

	/**
	 * Extend the nav tree easily.
	 *
	 *     yootil.create.nav_branch({url: "/shop/", text: "Shop"});
	 *
	 * @param {String} $0.url URL of the branch.
	 * @param {String} $0.text Text of the branch.
	 * @return {Object} Branch jQuery wrapped.
	 */

	static nav_branch({url = "/", text = ""} = {}){
		let $branch = yootil.get.last_nav_branch().clone();

		if($branch.length){
			$branch.find("a").attr("href", url).find("span").html(text);
			$branch.appendTo(yootil.get.nav_tree());
		}

		return $branch;
	}

	/**
	 * Create a new tab on the profile
	 *
	 *     yootil.create.profile_tab({text: "Test", page: "test", active: false});
	 *	 *
	 * @param {String} $0.text Text of the branch.
	 * @param {String} $0.page URL of the branch.
	 * @param {Boolean} [$0.active] Active page or not.
	 * @chainable
	 */

	static profile_tab({text = "", page = "/", active = false} = {}){
		if(yootil.location.profile()){
			let active_class = (active)? " class='ui-active'" : "";
			let $ul = $("div.show-user div.ui-tabMenu:first ul");

			if($ul.length){
				$ul.append($("<li" + active_class + "><a href='/user/" + yootil.page.member.id() + "/" + page + "'>" + text + "</a></li>"));
			}
		}

		return this;
	}

	/**
	 * Creates a profile content box.  Doesn't add to the DOM.
	 *
	 *     yootil.create.profile_content_box();
	 *
	 * @param {String} id Enter a ID, or a unique one will be created.
	 * @return {Object} The box is returned wrapped with jQuery.
	 */

	static profile_content_box(id = ""){
		let uid = (id || $.unique_id("yootil-"));

		return $("<div />").addClass("content-box center-col").attr("id", uid);
	}

	/**
	 * Adds a new BBC button to the end on the reply page.
	 *
	 * Note:  Due to the WYSIWYG being dynamically created, this can fail.
	 *
	 * @param {Object} $0.img The image element to append.
	 * @param {Function} [$0.func] Adds an onlick event.
	 * @chainable
	 */

	static bbc_button({img = "", func = null} = {}){
		$(() => {
			let $li = $("<li>").addClass("button").append($(img));

			if(func){
				$li.click(func);
			}

			let $controls = $(".editor .ui-wysiwyg .controls");
			let $ul = $controls.find(".bbcode-editor, .visual-editor").find(".group:last ul:last");

			if($controls.length && $ul.length){
				$ul.append($li);
			}
		});

		return this;
	}

	/**
	 * Creates a new tab next to the BBCode tab on post / message reply pages.
	 *
	 *     let $my_tab = yootil.create.ubbc_tab("My Title", "My Content");
	 *
	 * An example using the hide and show events:
	 *
	 *     let $my_tab2 = yootil.create.ubbc_tab("My Title 2", "My Content 2", "myid2", null, {
	 *
	 *         show: function(tab, tab_content){
	 *     		   tab.css("background-color", "red");
	 *         },
	 *
	 *         hide: function(tab, tab_content){
	 *     		   tab.css("background-color", "");
	 *         }
	 *
	 *     );
	 *
	 * @param {String} $0.title The title for the tab, this can contain HTML.
	 * @param {String} $0.content The content that will be shown when the tab is clicked.  HTML can be used.
	 * @param {String} [$0.id] The id for this tab.  If not specified a random one will be created.
	 * @param {Object} [$0.css] You can apply an object of css values that jQuery will apply, or defaults will be used.
	 * @param {Object} [$0.events] There are 2 events, show and hide.
	 * @param {Function} [$0.events.show] When the tab is clicked, this event will be called.  Tab and content are passed.
	 * @param {Function} [$0.events.hide] When another tab is click, this event will be called.  Tab and content are passed.
	 * @param {Function} [$0.events.context] Set the context of the functions.
	 * @return {Object} The tab content div is returned wrapped with jQuery.
	 */

	static bbc_tab({title = "My Tab", content = "", id = "", css = null, events = {}} = {}){
		id = id || yootil.timestamp();

		let $wysiwyg_tabs = $(".editor ul.wysiwyg-tabs");
		let $tab = $("<li id='menu-item-" + id + "'><a href='#'>" + title + "</a></li>");
		let $tab_content = $("<div id='" + id + "'>" + content + "</div>");

		$wysiwyg_tabs.append($tab);
		
		if(css && typeof css == "object"){
			$tab_content.css(css);
		} else {
			$tab_content.css({

				border: "1px solid #E6E6E6",
				padding: "5px"

			});
		}

		$tab_content.hide().insertBefore($wysiwyg_tabs);

		$wysiwyg_tabs.find("li").click(function(e){
			let $active = $(this);

			e.preventDefault();

			$active.parent().find("li").removeClass("ui-active");
			$active.addClass("ui-active");

			$active.parent().find("li").each(function(){
				let id = $(this).attr("id");

				if(id.match(/bbcode|visual/i)){
					$(".editor .ui-wysiwyg .editors").hide();
				} else {
					if($active.attr("id") == id){
						return;
					}

					let selector = "";

					if(id){
						selector = "#" + id.split("menu-item-")[1];
					}

					if($(selector).length){
						if(events && events.hide){
							if(events.context){
								events.hide.bind(events.context)($tab, $tab_content);
							} else {
								events.hide($tab, $tab_content);
							}
						}

						$(selector).hide();
					}
				}
			});

			let id = $active.attr("id");
			let selector = "";

			if(id){
				selector = "#" + id.split("menu-item-")[1];
			}

			if(id.match(/bbcode|visual/i)){
				$(".editor .ui-wysiwyg .editors").show();
			} else if($(selector).length){
				console.log(events);

				if(events && events.show){
					if(events.context){
						events.show.bind(events.context)($tab, $tab_content);
					} else {
						events.show($tab, $tab_content);
					}
				}

				$(selector).show();
			}
		});

		return $tab_content;
	}

};