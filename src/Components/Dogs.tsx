import { useDogContext } from "../providers/DogProvider";
import { DogCard } from "./DogCard";

export const Dogs = () => {
  const { loading, removeDog, toggleDogFavorite, getDogsPage } =
    useDogContext();
  const activeDogs = getDogsPage();

  return (
    <>
      {activeDogs.map((dog) => {
        return (
          <DogCard
            key={dog.id}
            dog={dog}
            onTrashIconClick={() => {
              removeDog(dog.id).catch(() => {
                throw new Error(`Error has occurred deleting dog ${dog.id}`);
              });
            }}
            onEmptyHeartClick={() => {
              toggleDogFavorite(true, dog.id).catch(() => {
                throw new Error(
                  `Error has occurred adding dog ${dog.id} to favorites`
                );
              });
            }}
            onHeartClick={() => {
              toggleDogFavorite(false, dog.id).catch(() => {
                throw new Error(
                  `Error has occurred removing dog ${dog.id} to favorites`
                );
              });
            }}
            isLoading={loading}
          />
        );
      })}
    </>
  );
};
