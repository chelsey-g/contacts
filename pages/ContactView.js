import "@aws-amplify/ui-react/styles.css";
import ContactEdit from "./ContactEdit";
import propTypes from "prop-types";
import { useForm } from "react-hook-form";
import {
  createContact,
  deleteContact,
  updateContact,
} from "../src/graphql/mutations";
// import { API, Geo, Storage, graphqlOperation } from "aws-amplify";
import { Fragment, useEffect, useState } from "react";
// import {
//   getContact,
//   contactsByName,
//   searchContacts,
// } from "../src/graphql/queries";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../src/aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

export default function ContactView(props) {
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
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  return (
    <div className="place-content-center">
      <div>
        <img
          className="h-132 w-full object-cover lg:h-80"
          src="https://wallpaperaccess.com/full/2667331.jpg"
          alt="cover photo"
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img
              className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
              src="https://chelseygowac.com/_next/image?url=%2Fme.jpg&w=3840&q=75"
              alt="profile picture"
            />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {props.contact.name}
              </h1>
            </div>
            <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <span>Message</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <span>Call</span>
              </button>

              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => setShowEditForm(true)}
              >
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">
            {props.contact.name}
          </h1>
        </div>
      </div>

      {/* contact body */}
      <div className="mt-5 border-t border-gray-200">
        <dl className="text-sm">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{props.contact.name}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Mobile Phone</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{props.contact.phone_mobile}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Work Phone</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{props.contact.phone_work}</span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                **needs to be added to form queries**
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                **needs to be added to form queries**
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

ContactView.propTypes = {
  contact: propTypes.object.isRequired,
};
