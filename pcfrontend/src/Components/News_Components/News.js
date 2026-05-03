import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {

  static defaultProps = {
    country: 'us',
    pageSize: 6,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
    // document.title = `Pulse Community | News`;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    async fetchNews(page) {
      this.props.setProgress(0);
      this.setState({ loading: true });
      const { country, category, pageSize, apikey } = this.props;  // ✅ keep props

      let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apikey=${apikey}&page=${page}&pageSize=${pageSize}`;
      
      let data = await fetch(url);
      this.props.setProgress(40);
      let parsedData = await data.json();
      this.props.setProgress(80);

      this.setState({
        articles: page === 1 ? parsedData.articles : this.state.articles.concat(parsedData.articles),
        loading: false,
        totalResults: parsedData.totalResults,
        page: page
      });

      this.props.setProgress(100);
    }


  componentDidMount() {
    this.fetchNews(this.state.page);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState({ page: 1, articles: [] }, () => {
        this.fetchNews(1);
      });
    }
  }

  fetchMoreData = () => {
    if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.props.pageSize)) {
      this.fetchNews(this.state.page + 1);
    }
  }

  render() {
    return (
      <div>
        <div className="container mt-4">
          <h3 className='text-center mb-2' style={{marginTop :"90px"}}>
            Pulse Community News: Top Headlines - {this.capitalizeFirstLetter(this.props.category)}
          </h3>
          {this.state.loading && <Spinner />}
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className='row'>
              {this.state.articles.map((element) => {
                return (
                  <div className='col-md-4 my-3' key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={element.description ? element.description.slice(0, 100) : ""}
                      Imageurl={element.urlToImage ? element.urlToImage : "https://westernnews.media.clients.ellingtoncms.com/img/photos/2018/08/07/Breaking_news_red.jpg"}
                      newsurl={element.url}
                      author={element.author ? element.author : "Unknown"}
                      date={element.publishedAt ? element.publishedAt : ""}
                      source={element.source.name ? element.source.name : "Unknown"}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default News;
