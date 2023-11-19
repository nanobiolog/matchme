const fs = require('fs');

const getFileName = filePath => filePath.split('/').pop();

try {
  // Read the content of the JSON files
  const file1Content = fs.readFileSync('movies1.json', 'utf8');
  const file2Content = fs.readFileSync('movies2.json', 'utf8');

  console.log('File 1 Content:', file1Content);
  console.log('File 2 Content:', file2Content);

  // Parse the JSON content
  const data1 = JSON.parse(file1Content);
  const data2 = JSON.parse(file2Content);

  // Check if movies1 and movies2 have a "movies" array and a "username" property
  if (!Array.isArray(data1.movies) || !Array.isArray(data2.movies) || !data1.username || !data2.username) {
    throw new Error('Failed to parse JSON files');
  }

  // Find common movies based on letterboxdId
  const commonMovies = data1.movies.reduce((result, movie1) => {
    const matchingMovie2 = data2.movies.find(movie2 => movie2.letterboxdId === movie1.letterboxdId);

    if (matchingMovie2) {
      result.push({
        letterboxdId: movie1.letterboxdId,
        title: movie1.title,
        ratings: {
          [data1.username]: movie1.letterboxdRating,
          [data2.username]: matchingMovie2.letterboxdRating,
        },
      });
    }

    return result;
  }, []);

  // Create a new JSON object with common movies
  const commonMoviesObject = { commonMovies };

  // Convert the object to JSON string
  const commonMoviesJSON = JSON.stringify(commonMoviesObject, null, 2);

  // Write the common movies to a new JSON file
  fs.writeFileSync('commonMovies.json', commonMoviesJSON);

  console.log('Common Movies:', commonMovies);
  console.log('Common Movies saved to commonMovies.json');
} catch (error) {
  console.error('Error:', error.message);
}
