import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import common, { UserInfo } from "../Common";
// import { useUser } from "../user/userProvider";
import DirectMessageCreateModal from "./DirectMessageCreateModal";
import { CiSquarePlus } from "react-icons/ci";

const DirectMessageList = ({
  loginedUser,
  setToUserId,
}: {
  loginedUser: UserInfo | undefined;
  setToUserId: (id: number) => void;
}) => {
  const [recipients, setRecipients] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const closeModal = () => setCreateModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_ENV +
            "/chat/direct_message_list/" +
            loginedUser?.id
        );
        console.log(res.data);
        setRecipients(res.data);
        // setToUserId(res.data[0].user_id);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [loginedUser]);

  return (
    <>
      <div className="h-custom-50">
        <div className="roomListHeader">
          <p className="m-0 p-0">Direct Message</p>
          <Button className="no-button" onClick={() => setCreateModal(true)}>
            <CiSquarePlus size="2rem" />
          </Button>
        </div>
        <div className="itemsScroll">
          {recipients.map((recipient: UserInfo, idx: number) => (
            <div key={idx} className="dmItem">
              <div className="dmProfilePicure">
                <span>
                  <img
                    src={common.getProfileImagePath(recipient.image_path)}
                    className="img-fluid rounded-circle profileImage"
                    style={{ width: "3em", height: "3em", cursor: "pointer" }}
                  />
                </span>
              </div>
              <div
                className="dmProfile"
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => setToUserId(recipient.id)}
              >
                <div className="dmUserName">{recipient.username}</div>
                <div className="small dmGoal">
                  {common.GOAL_DICT[recipient.goal_id] +
                    " / " +
                    common.LEVEL_DICT[recipient.level_id]}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal show={createModal} onHide={closeModal}>
          <DirectMessageCreateModal
            recipients={recipients}
            setRecipients={setRecipients}
            closeModal={closeModal}
            setToUserId={setToUserId}
          />
        </Modal>
      </div>
    </>
  );
};

export default DirectMessageList;
