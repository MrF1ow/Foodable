const renderRightSideCard = () => {
  return (
    <>
      {splitLayout && currentType && data && currentMetadata ? (
        <SavedItemPopup
          toggleDialog={togglePopUp}
          typeOfData={currentType}
          data={data!}
          metadata={currentMetadata}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};
