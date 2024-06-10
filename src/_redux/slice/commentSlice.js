import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllCommentByTaskId,
  createNewComment,
  deleteComment,
  likeComment,
  likeReply,
  updateContentComment,
  createNewReply,
  updateReply,
  deleteReplyComment,
} from "../../services/api.service";
import { reject } from "lodash";
const getPagingComments = createAsyncThunk(
  "/comments/get-all-comment-by-task-id",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await getAllCommentByTaskId(taskId);
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const createComment = createAsyncThunk(
  "/comments/create-comment",
  async ({ task, content, handleSetVisible }, { rejectWithValue }) => {
    try {
      const res = await createNewComment({ task, content });
      handleSetVisible();
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const createNewReplyAc = createAsyncThunk(
  "/comments/create-reply",
  async ({ cmtId, content, onClose }, { rejectWithValue }) => {
    try {
      const res = await createNewReply(cmtId, { content });
      onClose();
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const deleteCommentAc = createAsyncThunk(
  "/comment/delete-comment",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await deleteComment(commentId);
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const deleteReplyAc = createAsyncThunk(
  "/comment/deleteReplyComment",
  async ({ replyid, cmtId }, { rejectWithValue }) => {
    try {
      const res = await deleteReplyComment(replyid, cmtId);
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);

const likeReplyAc = createAsyncThunk(
  "/comment/like-reply",
  async ({ replyid, cmtId }, { rejectWithValue }) => {
    try {
      const res = await likeReply(replyid, cmtId);
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const likeCommentAc = createAsyncThunk(
  "/comment/like-comment",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await likeComment(commentId);
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const updateCommentAc = createAsyncThunk(
  "/comment/update-content-comment",
  async ({ commentId, content, handleSetVisible }, { rejectWithValue }) => {
    try {
      const res = await updateContentComment(commentId, content);
      handleSetVisible();
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
const updateReplyAc = createAsyncThunk(
  "/comment/update-content-reply",
  async ({ id, cmtId, content, handleSetVisible }, { rejectWithValue }) => {
    try {
      const res = await updateReply(id, { content, cmtId });
      handleSetVisible();
      return res;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);
export const commentSlice = createSlice({
  name: "comment",
  initialState: {
    isLoading: false,
    listComment: [],
    totalComment: 0,
    isLoadingCreateComment: false,
    isLoadingCreateReply: false,
    isLoadingUpdateComment: false,
    isLoadingUpdateReply: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPagingComments.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPagingComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.listComment = action.payload?.data?.data?.comments.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  );
      state.totalComment = action.payload?.data?.data?.totalComment;
    });

    builder.addCase(getPagingComments.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createComment.pending, (state, action) => {
      state.isLoadingCreateComment = true;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.isLoadingCreateComment = false;
      state.totalComment += 1;
      state.listComment.unshift(action?.payload?.data?.comment);
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.isLoadingCreateComment = false;
    });

    builder.addCase(createNewReplyAc.pending, (state, action) => {
      state.isLoadingCreateReply = true;
    });
    builder.addCase(createNewReplyAc.fulfilled, (state, action) => {
      state.isLoadingCreateReply = false;
      const { cmtId, reply } = action.payload?.data;

      const comment = state.listComment.find(
        (comment) => comment._id === cmtId
      );
      if (comment) {
        comment.replies?.unshift(reply);
      }
    });
    builder.addCase(createNewReplyAc.rejected, (state, action) => {
      state.isLoadingCreateReply = false;
    });

    builder.addCase(deleteCommentAc.pending, (state, action) => {});
    builder.addCase(deleteCommentAc.fulfilled, (state, action) => {
      const commentIdToDelete = action.payload?.data?.id;
      state.listComment = state.listComment.filter(
        (comment) => comment._id !== commentIdToDelete
      );
      state.totalComment -= 1;
    });

    builder.addCase(deleteCommentAc.rejected, (state, action) => {});

    builder.addCase(deleteReplyAc.pending, (state, action) => {});
    builder.addCase(deleteReplyAc.fulfilled, (state, action) => {
      const { cmtId, replyId } = action.payload?.data;
      const commentIndex = state.listComment.findIndex(
        (comment) => comment._id === cmtId
      );
      if (commentIndex !== -1) {
        const replyIndex = state.listComment[commentIndex].replies.findIndex(
          (reply) => reply._id === replyId
        );
        if (replyIndex !== -1) {
          state.listComment[commentIndex].replies.splice(replyIndex, 1);
        }
      }
    });

    builder.addCase(deleteReplyAc.rejected, (state, action) => {});

    builder.addCase(likeCommentAc.pending, (state, action) => {});
    builder.addCase(likeCommentAc.fulfilled, (state, action) => {
      const { cmtId, action: likeAction, ...user } = action.payload?.data?.data;
      const comment = state.listComment.find((cmt) => cmt._id === cmtId);
      if (comment) {
        if (likeAction === "like") {
          comment.likes.push(user);
        } else {
          comment.likes = comment.likes.filter((like) => like._id !== user._id);
        }
      }
    });

    builder.addCase(likeCommentAc.rejected, (state, action) => {});

    builder.addCase(likeReplyAc.pending, (state, action) => {});
    builder.addCase(likeReplyAc.fulfilled, (state, action) => {
      const {
        cmtId,
        replyId,
        action: likeAction,
        ...user
      } = action.payload?.data?.data;
      const commentIndex = state.listComment.findIndex(
        (comment) => comment._id === cmtId
      );
      if (commentIndex !== -1) {
        const comment = state.listComment[commentIndex];
        const replyIndex = comment.replies.findIndex(
          (reply) => reply._id === replyId
        );
        if (replyIndex !== -1) {
          if (likeAction === "like") {
            comment.replies[replyIndex].likes.push(user);
          } else {
            comment.replies[replyIndex].likes = comment.replies[
              replyIndex
            ].likes.filter((like) => like._id !== user._id);
          }
        }
      }
    });

    builder.addCase(likeReplyAc.rejected, (state, action) => {});

    builder.addCase(updateCommentAc.pending, (state, action) => {
      state.isLoadingUpdateComment = true;
    });
    builder.addCase(updateCommentAc.fulfilled, (state, action) => {
      state.isLoadingUpdateComment = false;
      const { cmtId, content } = action.payload?.data?.data;
      const comment = state.listComment.find((cmt) => cmt._id === cmtId);
      if (comment) comment.content = content;
    });

    builder.addCase(updateCommentAc.rejected, (state, action) => {
      state.isLoadingUpdateComment = false;
    });

    builder.addCase(updateReplyAc.pending, (state, action) => {
      state.isLoadingUpdateReply = true;
    });
    builder.addCase(updateReplyAc.fulfilled, (state, action) => {
      state.isLoadingUpdateReply = false;
      const { cmtId, replyId, content } = action.payload?.data?.data;
      const comment = state.listComment.find(
        (comment) => comment._id === cmtId
      );
      if (comment) {
        const reply = comment?.replies?.find((reply) => reply._id === replyId);
        if (reply) {
          reply.content = content;
        }
      }
    });

    builder.addCase(updateReplyAc.rejected, (state, action) => {
      state.isLoadingUpdateReply = false;
    });
  },
});
export const commentAction = {
  getPagingComments,
  createComment,
  deleteCommentAc,
  likeCommentAc,
  likeReplyAc,
  updateCommentAc,
  createNewReplyAc,
  updateReplyAc,
  deleteReplyAc,
};
export default commentSlice.reducer;
