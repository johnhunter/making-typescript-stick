export interface DataEntity {
  id: string;
}
export interface Movie extends DataEntity {
  director: string;
}
export interface Song extends DataEntity {
  singer: string;
}

export interface Comic extends DataEntity {
  issueNumber: string;
}

export interface DataEntityMap {
  movie: Movie;
  song: Song;
}

// export interface DataEntityMap {
//   comic: Comic;
// }

/**
 * Dynamically build the type from the DataEntityMap
 * - mapped types "in"
 * - template literal types "`${foo}`"
 * - with key remapping utilities to build camelized method names from the entities "Capitalize<K>"
 * - then the return values use indexed access types from the entities "DataEntityMap[K]"
 * Note only one index signature allowed so we have to use union
 */
type DataStoreMethods = {
  [K in keyof DataEntityMap as `getAll${Capitalize<K>}s`]: () => DataEntityMap[K][];
} & {
  [K in keyof DataEntityMap as `get${Capitalize<K>}`]: (
    id: string
  ) => DataEntityMap[K];
} & {
  [K in keyof DataEntityMap as `clear${Capitalize<K>}s`]: () => void;
} & {
  [K in keyof DataEntityMap as `add${Capitalize<K>}`]: (
    arg: DataEntityMap[K]
  ) => DataEntityMap[K];
};

// a type guard
function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== "undefined";
}

export class DataStore implements DataStoreMethods {
  #data: { [K in keyof DataEntityMap]: Record<string, DataEntityMap[K]> } = {
    movie: {},
    song: {},
  };
  addSong(s: Song): Song {
    this.#data.song[s.id] = s;
    return s;
  }
  getAllSongs(): Song[] {
    const songs = this.#data.song;
    return Object.keys(songs)
      .map((key) => songs[key])
      .filter(isDefined); // or can use `!` as we know the keys
  }
  getSong(id: string): Song {
    const song = this.#data.song[id];
    if (!song) throw new Error(`Could not find song with id ${id}`);
    return song;
  }
  clearSongs(): void {
    this.#data.song = {};
  }
  addMovie(m: Movie): Movie {
    this.#data.movie[m.id] = m;
    return m;
  }
  getAllMovies(): Movie[] {
    const movies = this.#data.movie;
    return Object.keys(movies)
      .map((key) => movies[key])
      .filter(isDefined);
  }
  getMovie(id: string): Movie {
    const movie = this.#data.movie[id];
    if (!movie) throw new Error(`Could not find movie with id ${id}`);
    return movie;
  }
  clearMovies(): void {
    this.#data.movie = {};
  }
}

// --
// --

const ds = new DataStore();
ds.addSong({ id: "song-123", singer: "The Flaming Lips" });
ds.addMovie({
  id: "movie-456",
  director: "Stephen Spielberg",
});
ds.getSong("song-123"); // returns the song
ds.getMovie("movie-456"); // returns the movie
ds.getAllSongs(); // array of all songs
ds.getAllMovies(); // array of all movies
ds.clearSongs(); // clears all songs
ds.clearMovies(); // clears all movies
