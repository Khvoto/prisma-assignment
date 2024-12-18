// Start by installing the project with `npm install`
// Initialize the project with `npx prisma init`
// Set your connection string in the `.env` file
// Set up your schema.prisma file
// Generate the client with `npx prisma generate`
// Push the changes with `npx prisma db push` (That will also generate the client again)
// Run the app with `npm run start`

import PromptSync from "prompt-sync";

// PrismaClient is imported as a singleton to make sure it is only created once.
// Reference: https://www.prisma.io/docs/concepts/components/prisma-client

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient;

// Example usage of prisma client
/* try {
  await prisma.movies.create({


    data: {
      title: "The Matrix",
      year: 1999,
    },
  });
} 
catch (error) {
    console.error("An error occurred:", error);
    console.log("Please try again.");
} */
//console.log(`Movie ${title} added successfully!`);

const input = PromptSync();

async function addMovie() {

  // Expected:
  // 1. Prompt the user for movie title, year.
  // 2. Use Prisma client to create a new movie with the provided details.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created movie details.
  //
  // Transactions and relationships (This we can add later on)
  //    Reference : https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  // Expected:
  // 1.b Prompt the user for genre.
  // 2.b If the genre does not exist, create a new genre.
  // 3.b Ask the user if they want to want to add another genre to the movie.

  const title = input('Enter the title of the movie to be added: ');
  const year = parseInt(input('Enter the release year of the movie: '));

  const createdMovie = await prisma.movies.create ({
    data: { title, year }, 
  })

  while(true) {
    const genreName = input('Enter the movie genre: ');
    const genreExist = await prisma.genres.findFirst({
      where: {genre: genreName}
    })
    if(!genreExist) {
      await prisma.genres.create({
        data: {
          genre: genreName,
          movies: {
            connect: { id: createdMovie.id },
          }
        }
      }) 
    }
    else {
      await prisma.genres.update ({
        where: { id : genreExist?.id },
        data: {
          movies : {
            connect: { id : createdMovie.id}
          }
        }
      })
    }
    const moreGenres = input('Want to add another genre?(y/n) ')
    if(moreGenres === 'n' || moreGenres === 'N') {
      break;
    }
  }

  console.log('The movie ', title, 'with the releaseyear:', year, 'has been added.')

}

async function updateMovie() {
  // Expected:
  // 1. Prompt the user for movie ID to update.
  // 2. Prompt the user for new movie title, year.
  // 3. Use Prisma client to update the movie with the provided ID with the new details.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
  // 4. Print the updated movie details.

  const updateId = parseInt(input('Which movie Id do you want to update? '))
  const updateTitle = input('What do you wish to update the title to? ')
  const updateReleaseYear = parseInt(input('Which year did the movie release? '))
  const idExist = await prisma.movies.findFirst ({
    where: { id : updateId}
  })

  if (idExist) {
    await prisma.movies.update ({
      where: { id : updateId },
      data : {
        title: updateTitle,
        year: updateReleaseYear
      }
    })
  }
}

async function deleteMovie() {
  // Expected:
  // 1. Prompt the user for movie ID to delete.
  // 2. Use Prisma client to delete the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
  // 3. Print a message confirming the movie deletion.
}

async function listMovies() {
  // Expected:
  // 1. Use Prisma client to fetch all movies.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 2. Include the genre details in the fetched movies.
  // 3. Print the list of movies with their genres (take 10).
}

async function listMovieById() {
  // Expected:
  // 1. Prompt the user for movie ID to list.
  // 2. Use Prisma client to fetch the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
  // 3. Include the genre details in the fetched movie.
  // 4. Print the movie details with its genre.
}

async function listMovieByGenre() {
  // Expected:
  // 1. Prompt the user for genre Name to list movies.
  // 2. Use Prisma client to fetch movies with the provided genre ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 3. Include the genre details in the fetched movies.
  // 4. Print the list of movies with the provided genre (take 10).
}

async function addGenre() {
  // Expected:
  // 1. Prompt the user for genre name.
  // 2. Use Prisma client to create a new genre with the provided name.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created genre details.
}

async function main() {
  while (true) {
    try {
      console.log("1. Add movie");
      console.log("2. Update movie");
      console.log("3. Delete movie");
      console.log("4. List movies");
      console.log("5. List movie by ID");
      console.log("6. List movies by genre");
      console.log("7. Add genre");
      console.log("0. Exit");

      const choice = input("Enter your choice: ");

      switch (choice) {
        case "1":
          await addMovie();
          break;
        case "2":
          await updateMovie();
          break;
        case "3":
          await deleteMovie();
          break;
        case "4":
          await listMovies();
          break;
        case "5":
          await listMovieById();
          break;
        case "6":
          await listMovieByGenre();
          break;
        case "7":
          await addGenre();
          break;
        case "0":
          return;
        default:
          console.log("Invalid choice");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("Please try again.");
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
