// import React from 'react';
// import {
//   Dialog, DialogActions, DialogContent, DialogTitle,
// } from '@material-ui/core';
// import UploadDlg from '../Header/UploadDlg';
// import CustomMonaco from '../elements/CustomMonaco';
// import Loader from '../Loader';
//
// function PreviewSection({ open }) {
//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="form-dialog-title"
//     >
//       <DialogTitle id="form-dialog-title">
//         {`Import Data to ${type.label} for ${client.name}`}
//       </DialogTitle>
//
//       <DialogContent>
//         {
//           !uploadFlag ? (
//             <>
//               <UploadDlg
//                 onChangeData={onChangeHandle('data')}
//                 clientType={type.key}
//               />
//               {
//                 type.key !== 'products'
//                 && (
//                   <CustomMonaco
//                     label="Edit"
//                     value={importData}
//                     key="upload"
//                     onChange={(data) => onEditHandle(data)}
//                   />
//                 )
//               }
//             </>
//           ) : (
//             <div className="upload_loader">
//               <Loader size="small" color="dark" />
//             </div>
//           )
//         }
//       </DialogContent>
//
//       <DialogActions className={classes.dialogAction}>
//         <button
//           className="mg-button secondary"
//           disabled={isUploading}
//           onClick={handleClose}
//         >
//           Cancel
//         </button>
//         {
//           importData !== ''
//           && (
//             <button
//               className="mg-button primary"
//               disabled={isUploading}
//               onClick={handleSubmit}
//             >
//               Save
//             </button>
//           )
//         }
//       </DialogActions>
//     </Dialog>
//   );
// }
// export default PreviewSection;
