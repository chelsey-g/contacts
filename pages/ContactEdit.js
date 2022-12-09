import "@aws-amplify/ui-react/styles.css";
import { useForm } from "react-hook-form";
import {
  createContact,
  deleteContact,
  updateContact,
} from "../src/graphql/mutations";
import { API, Geo, Storage, graphqlOperation } from "aws-amplify";
import { Fragment, useEffect, useState } from "react";
import {
  getContact,
  contactsByName,
  searchContacts,
} from "../src/graphql/queries";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../src/aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

export default function ContactEdit(props) {
  console.log("props", props);
  const { register, handleSubmit, reset, watch, formState, setValue } = useForm(
    {
      defaultValues: {
        name: props?.contact?.name,
        phone_mobile: props?.contact?.phone_mobile,
        phone_home: props?.contact?.phone_home,
        email: props?.contact?.email,
        address: props?.contact?.address,
        city: "",
        state: "",
        zip: "",
      },
    }
  );
  const [contacts, setContacts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [phoneEntryError, setPhoneEntryError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactPhoto, setContactPhoto] = useState(null);
  const [showViewForm, setShowViewForm] = useState(false);

  const handleDeleteContact = async (id) => {
    try {
      const contact = await API.graphql(graphqlOperation(getContact, { id }));
      API.graphql({
        query: deleteContact,
        variables: {
          input: {
            id,
          },
        },
      }).then((data) => {
        setContacts(
          contacts.filter(
            (contact) => data.data.deleteContact.id !== contact.id
          )
        );
        setShowDeleteModal(!showDeleteModal);
        setShowEditForm(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  async function handleUpdateContact(data) {
    delete data.createdAt;
    delete data.updatedAt;
    delete data.owner;
    try {
      API.graphql({
        query: updateContact,
        variables: {
          input: {
            type: "Contact",
            ...data,
          },
        },
      }).then((data) => {
        let newContact = contacts.filter(
          (contact) => data.data.updateContact.id !== contact.id
        );
        newContact.push(data.data.updateContact);
        setContacts(newContact);
        setShowEditForm(false);
      });
    } catch (e) {
      console.log(e);
    }
  }

  function refreshPage() {
    window.location.reload(false);
  }

  async function onSubmit(formData) {
    let data = await API.graphql({
      query: createContact,
      variables: {
        input: {
          type: "Contact",
          ...formData,
        },
      },
    });
    setContacts([...contacts, data.data.createContact]);
    setCurrentContact(data.data.createContact);
    reset();
    setShowEditForm(false);
    refreshPage();
  }

  function handlePhoneValidation(event) {
    const value = event.target.value;
    const isInvalid = value.length < 10;
    setPhoneEntryError(isInvalid ? "Phone number must be 10 digits" : null);
  }

  async function uploadPhoto(e) {
    const file = e.target.files[0];
    try {
      const result = await Storage.put(currentContact.id, file);
      const photoURL = await Storage.get(currentContact.id);
      setContactPhoto(photoURL);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section
      aria-labelledby="primary-heading"
      className="p-5 flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        key={currentContact?.id}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Contact
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Enter the details of the required fields.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      {...register("name")}
                      type="text"
                      className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(event) =>
                        setValue(
                          "name",
                          event.target.value.charAt(0).toUpperCase() +
                            event.target.value.slice(1)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Mobile Phone
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      {...register("phone_mobile")}
                      type="text"
                      className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={handlePhoneValidation}
                    />
                    <div style={{ color: "red" }}>{phoneEntryError}</div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Work Phone
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      {...register("phone_work")}
                      type="text"
                      className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={handlePhoneValidation}
                    />
                    <div style={{ color: "red" }}>{phoneEntryError}</div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Notes
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={""}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <img src={contactPhoto} width="50" height="50" />
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center">
                    <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      ></svg>
                    </span>
                    <input
                      name="photo"
                      type="file"
                      className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onChange={uploadPhoto}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Cover photo
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={props.onClose}
            >
              Cancel
            </button>

            {currentContact?.id && (
              <button
                disabled={Boolean(phoneEntryError)}
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleSubmit(handleUpdateContact)}
              >
                Update
              </button>
            )}

            {!currentContact?.id && (
              <button
                disabled={Boolean(phoneEntryError)}
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                // onClick={refreshPage}
              >
                Save
              </button>
            )}

            {currentContact?.id && (
              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            )}

            {showDeleteModal && (
              <div
                className="relative z-10"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              className="h-6 w-6 text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                              />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3
                              className="text-lg font-medium leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Delete contact
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to delete this contact?
                                All of your data will be permanently deleted.
                                This cannot be undone.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(currentContact.id)}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Delete Contact
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(false)}
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
