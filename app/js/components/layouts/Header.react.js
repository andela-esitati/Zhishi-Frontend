import React from 'react';
import SearchBar from '../search/searchBar/SearchBarContainer.react';
import Common from '../../utils/Common.js';
import Auth from '../../auth';
import {Link} from 'react-router';
import LoadingDots from './LoadingDots';

var lastScroll = $(window).scrollTop();

class Header extends React.Component {
  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    $('.ui.dropdown').dropdown();
    $('.share-popup').popup();

    $(window).scroll(function() {
      var scroll = $(this).scrollTop(), header = $('header');
      if (scroll > header.height) {
        header.slideUp();
      } else {
        changeHeaderCSS(header, scroll);
        header.slideDown();
      }
      lastScroll = scroll;
    });

    function changeHeaderCSS(header, scroll) {
      if (scroll > 0) {
        if (!header.hasClass('scrolling')) { header.addClass('scrolling'); }
      } else {
        header.removeClass('scrolling');
      }
    }
  }

  render() {
    const {loading} = this.props;
    var current_user = Auth.getCurrentUser() || {};
    var permalink = Common.createPermalink(current_user.id, current_user.name);
    var heading_helper_text = '<div class=header-text><span>Zhishi</span> means <span>Knowledge</span> in chinese</div>';
    return (
      <header>
        <nav className="navigation">
          <div className="ui menu">
            <div className="ui container">
              <Link to="#" className="item sidebar-icon mobile-only">
                <i className="sidebar icon"></i>
              </Link>
              <div className="item logo-wrapper">
                <Link to="/" className="share-popup" data-html={heading_helper_text} data-variation="very wide">
                  <img src="/assets/img/logo-footer.png" alt="zhishi-logo" className="logo" />
                </Link>
              </div>

              <div className="right menu">
                <Link to="/questions/new" className="item mobile-only">
                  <i className="plus icon"></i>
                  Ask Question
                </Link>
                {loading && <LoadingDots interval={100} dots={20} />}
                <Link to="#" className="selectTagModal-trigger item">Tags</Link>
                <Link to="#" className="selectFeedbackModal-trigger item">Feedback ? </Link>
                <div className="pointing ui dropdown item">
                  <img src={current_user.image || '/assets/img/avatar.png'} alt="user-profile-image" className="profile-img" />
                  <i className="dropdown icon"></i>

                  <div className="menu">
                    <Link to={`/users/${permalink}`} className="item"><i className="user icon"></i> Profile</Link>
                    {/*<Link to="#" className="item"><i className="setting icon"></i> Settings</Link>*/}
                    <Link to="/logout" className="item"><i className="privacy icon"></i> Log out</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </nav>
        <SearchBar />
      </header>
    );
  }
}
module.exports = Header;
