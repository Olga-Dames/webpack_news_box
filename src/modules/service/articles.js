import moment from 'moment';

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = '364fa8ee9d7346e7bae6dc97f478dce1';
const OPTIONS = {
  headers: {
    Authorization: API_KEY,
  },
};

class ArticlesService {
  #previousQuery = null;

  #page = 1;

  fetchData(searchQuery) {
    this.#page = searchQuery === this.#previousQuery ? this.#page + 1 : 1;
    this.#previousQuery = searchQuery;
    const searchParams = new URLSearchParams({
      q: searchQuery,
      sortBy: 'publishedAt',
      pageSize: 10,
      page: this.#page,
    });

    return fetch(`${BASE_URL}/everything?${searchParams}`, OPTIONS)
      .then((response) => response.json())
      .then(({ articles }) => ArticlesService.prepareData(articles))
      .catch((error) => {
        console.error(error);
      });
  }

  static prepareData(articles) {
    return articles.map((article) => {
      const {
        author, title, url, urlToImage, publishedAt, content,
      } = article;
      const { text, timeForReading } = ArticlesService.parseContent(content);
      return {
        url,
        text,
        title,
        author,
        content,
        urlToImage,
        timeForReading,
        publishDate: moment(publishedAt).format('lll'),
      };
    });
  }

  static parseContent(content) {
    const firstSepPosition = content.indexOf('[');
    const secondSepPosition = content.indexOf(']');
    const parseResult = {
      text: null,
      timeForReading: null,
    };

    if (firstSepPosition >= 0 && secondSepPosition >= 0) {
      const numberOfChars = parseInt(content.substring(firstSepPosition + 1, secondSepPosition));

      parseResult.text = content.substring(0, firstSepPosition);
      parseResult.timeForReading = ArticlesService.calculateTimeForReading(numberOfChars);
    }

    return parseResult;
  }

  static calculateTimeForReading(numberOfChars) {
    const minutes = Math.floor(numberOfChars / 255);

    if (minutes === 0) {
      return 'less then one minute';
    }

    if (minutes > 0 && minutes < 2) {
      return 'more then one minute';
    }

    return `${minutes} minutes`;
  }
}

export default new ArticlesService();
