import { useState } from "react";
import { dogPictures } from "../dog-pictures";
import toast from "react-hot-toast";
import { useDogContext } from "../providers/DogProvider";

type TForm = {
  name: string;
  description: string;
  image: string;
};

export const CreateDogForm = () => {
  const { loading, addDog } = useDogContext();
  const [form, setForm] = useState<TForm>({
    name: "",
    description: "",
    image: dogPictures.BlueHeeler,
  });

  const badInputs = form.name.length < 2 || form.description.length < 2;

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      image: dogPictures.BlueHeeler,
    });
  };

  const submitForm = () => {
    addDog({ ...form, isFavorite: false })
      .then(() => {
        resetForm();
      })
      .catch(() => {
        toast.error(`Error has occurred creating a dog.`);
      });
  };

  return (
    <form
      id="create-dog-form"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <h4>Create a New Dog</h4>
      <label htmlFor="name">Dog Name</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => {
          setForm({ ...form, name: e.target.value });
        }}
      />
      <label htmlFor="description">Dog Description</label>
      <textarea
        name=""
        id=""
        cols={80}
        rows={10}
        value={form.description}
        onChange={(e) => {
          setForm({ ...form, description: e.target.value });
        }}
      ></textarea>
      <label htmlFor="picture">Select an Image</label>
      <select
        id=""
        value={form.image}
        onChange={(e) => {
          setForm({ ...form, image: e.target.value });
        }}
      >
        {Object.entries(dogPictures).map(([label, pictureValue]) => {
          return (
            <option value={pictureValue} key={pictureValue}>
              {label}
            </option>
          );
        })}
      </select>
      <input type="submit" value="submit" disabled={loading || badInputs} />
    </form>
  );
};
